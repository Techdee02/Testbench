import {
  DiscoverSetsResponse,
  Question,
  QuestionFormat,
  QuestionPublicResponse,
  QuestionType,
  SetVisibility,
  SetVisibilityResponse,
  Upload,
  PracticeSession,
} from "./types";

// In-memory mock backend. Stands in for the Floater's FastAPI service +
// Postgres now deployed at NEXT_PUBLIC_API_BASE_URL; this only runs when
// that env var is unset, e.g. for offline frontend work. Shapes match the
// real backend's OpenAPI schema, not just the original PRD sketch.

const uploads = new Map<string, Upload>();
const questionsBySet = new Map<string, Question[]>();
const sessions = new Map<string, PracticeSession>();
const storage = new Map<string, { filename: string; size: number }>();
const usersByEmail = new Map<string, { id: string; email: string; password: string; token: string }>();

interface SetMeta {
  id: string;
  visibility: SetVisibility;
  share_token: string | null;
  title: string | null;
  created_at: string;
}

const setMetaBySetId = new Map<string, SetMeta>();

const MOCK_USER_ID = "11111111-1111-4111-8111-111111111111";

function uuid() {
  return crypto.randomUUID();
}

export function createUser(email: string, password: string) {
  if (usersByEmail.has(email)) return null;
  const id = uuid();
  const user = { id, email, password, token: `mock.${id}` };
  usersByEmail.set(email, user);
  return user;
}

export function verifyUser(email: string, password: string) {
  const user = usersByEmail.get(email);
  if (!user || user.password !== password) return null;
  return user;
}

export function createUpload(filename: string) {
  const id = uuid();
  const storage_key = `uploads/${id}/${encodeURIComponent(filename)}`;
  const upload: Upload = {
    id,
    user_id: MOCK_USER_ID,
    file_hash: uuid().replace(/-/g, ""),
    storage_key,
    filename,
    status: "uploaded",
    practice_mode: null,
    question_format: null,
    set_id: null,
    created_at: new Date().toISOString(),
  };
  uploads.set(id, upload);
  return upload;
}

export function getUpload(id: string) {
  return uploads.get(id) ?? null;
}

export function putStorageObject(key: string, filename: string, size: number) {
  storage.set(key, { filename, size });
}

export function startPipeline(
  id: string,
  practice_mode: Upload["practice_mode"],
  question_format: QuestionFormat
) {
  const upload = uploads.get(id);
  if (!upload) return null;
  upload.practice_mode = practice_mode;
  upload.question_format = question_format;
  upload.status = "processing";
  uploads.set(id, upload);

  // Simulate OCR + LLM structuring latency. Runs async so the frontend can
  // exercise its real polling loop against GET /uploads/:id. The set gets
  // its own id here — deliberately distinct from the upload id, matching
  // the real backend, so the frontend can't get away with conflating them.
  setTimeout(() => {
    const current = uploads.get(id);
    if (!current) return;
    const setId = uuid();
    current.status = "ready";
    current.set_id = setId;
    uploads.set(id, current);
    questionsBySet.set(setId, generateQuestionSet(setId, id, question_format));
    setMetaBySetId.set(setId, {
      id: setId,
      visibility: "private",
      share_token: null,
      title: null,
      created_at: new Date().toISOString(),
    });
  }, 4500);

  return upload;
}

export function getQuestions(setId: string) {
  return questionsBySet.get(setId) ?? null;
}

export function patchQuestion(id: string, patch: Partial<Question>) {
  for (const [setId, list] of questionsBySet) {
    const idx = list.findIndex((q) => q.id === id);
    if (idx !== -1) {
      const updated = { ...list[idx], ...patch };
      list[idx] = updated;
      questionsBySet.set(setId, list);
      return updated;
    }
  }
  return null;
}

export function createSession(setId: string, mode: PracticeSession["mode"]) {
  const questions = questionsBySet.get(setId) ?? [];
  const eligible = questions.filter((q) => q.status !== "discarded");
  const session: PracticeSession = {
    id: uuid(),
    set_id: setId,
    mode,
    question_ids: eligible.map((q) => q.id),
    created_at: new Date().toISOString(),
  };
  sessions.set(session.id, session);
  return session;
}

export function getSession(id: string) {
  return sessions.get(id) ?? null;
}

export function findQuestionById(id: string) {
  for (const list of questionsBySet.values()) {
    const found = list.find((q) => q.id === id);
    if (found) return found;
  }
  return null;
}

// Mirrors the real backend's rule: refuses to set a non-private visibility
// when nothing's confirmed yet. Returns "no_confirmed" so the route handler
// can respond with the same 400 shape the live API uses.
export function setSetVisibility(
  setId: string,
  visibility: SetVisibility
): SetVisibilityResponse | "no_confirmed" | null {
  const meta = setMetaBySetId.get(setId);
  if (!meta) return null;
  if (visibility !== "private") {
    const confirmedCount = (questionsBySet.get(setId) ?? []).filter(
      (q) => q.status === "confirmed"
    ).length;
    if (confirmedCount === 0) return "no_confirmed";
  }
  meta.visibility = visibility;
  meta.share_token = visibility === "shared" ? (meta.share_token ?? uuid()) : null;
  setMetaBySetId.set(setId, meta);
  return {
    id: meta.id,
    title: meta.title,
    visibility: meta.visibility,
    share_token: meta.share_token,
  };
}

export function getSetByShareToken(token: string): QuestionPublicResponse[] | null {
  for (const meta of setMetaBySetId.values()) {
    if (meta.visibility === "shared" && meta.share_token === token) {
      const questions = questionsBySet.get(meta.id) ?? [];
      return questions
        .filter((q) => q.status !== "discarded")
        .map((q) => ({
          id: q.id,
          set_id: q.set_id,
          question_type: q.question_type,
          stem: q.stem,
          options: q.options,
          status: q.status,
          created_at: q.created_at,
        }));
    }
  }
  return null;
}

export function listDiscoverSets(page: number, pageSize: number): DiscoverSetsResponse {
  const publicSets = [...setMetaBySetId.values()].filter((m) => m.visibility === "public");
  const total = publicSets.length;
  const start = (page - 1) * pageSize;
  const items = publicSets.slice(start, start + pageSize).map((m) => ({
    id: m.id,
    title: m.title,
    question_count: (questionsBySet.get(m.id) ?? []).filter((q) => q.status !== "discarded").length,
    created_at: m.created_at,
  }));
  return { items, page, page_size: pageSize, total };
}

// Deterministic-feeling fixture bank. Stands in for real OCR+LLM output so
// the practice loop is fully exercisable before the pipeline is live.
const QUESTION_BANK: Array<{
  type: QuestionType;
  stem: string;
  options?: string[];
  correct_answer: string;
  confidence: "high" | "low";
}> = [
  {
    type: "mcq",
    stem: "Which data structure gives O(1) average-case lookup by key?",
    options: ["Linked list", "Hash table", "Binary search tree", "Array"],
    correct_answer: "Hash table",
    confidence: "high",
  },
  {
    type: "mcq",
    stem: "In relational databases, which normal form eliminates transitive dependencies?",
    options: ["1NF", "2NF", "3NF", "BCNF"],
    correct_answer: "3NF",
    confidence: "high",
  },
  {
    type: "mcq",
    stem: "What does OCR confidence scoring primarily route in Testbench's pipeline?",
    options: [
      "Which student sees the question",
      "Whether the raw image or the extracted text gets sent to the model",
      "The practice mode default",
      "The upload file size limit",
    ],
    correct_answer: "Whether the raw image or the extracted text gets sent to the model",
    confidence: "low",
  },
  {
    type: "mcq",
    stem: "Which law states that voltage equals current multiplied by resistance?",
    options: ["Faraday's Law", "Ohm's Law", "Kirchhoff's Law", "Coulomb's Law"],
    correct_answer: "Ohm's Law",
    confidence: "high",
  },
  {
    type: "mcq",
    stem: "Which process converts glucose into pyruvate in cellular respiration?",
    options: ["Glycolysis", "Krebs cycle", "Electron transport chain", "Photolysis"],
    correct_answer: "Glycolysis",
    confidence: "low",
  },
  {
    type: "theory",
    stem: "Explain why retrieval practice produces stronger long-term retention than re-reading.",
    correct_answer:
      "Retrieval practice forces active reconstruction of memory, which strengthens the retrieval pathway itself, whereas re-reading only produces passive familiarity that does not transfer to recall under exam conditions.",
    confidence: "high",
  },
  {
    type: "theory",
    stem: "Describe the trade-off between normalization and query performance in database design.",
    correct_answer:
      "Normalization reduces redundancy and update anomalies by splitting data across related tables, but more tables means more joins at query time, which can slow reads — so systems often denormalize selectively for performance.",
    confidence: "high",
  },
  {
    type: "theory",
    stem: "Why does Testbench run OCR before the LLM step instead of sending every image straight to a multimodal model?",
    correct_answer:
      "It's a cost-control decision: OCR plus a small model is far cheaper than a multimodal call on every page, and the multimodal fallback is reserved only for the pages OCR actually fails on.",
    confidence: "low",
  },
  {
    type: "theory",
    stem: "Summarize the main difference between mitosis and meiosis.",
    correct_answer:
      "Mitosis produces two genetically identical diploid cells for growth and repair, while meiosis produces four genetically distinct haploid cells for sexual reproduction.",
    confidence: "high",
  },
];

function generateQuestionSet(setId: string, uploadId: string, format: QuestionFormat): Question[] {
  const pool = QUESTION_BANK.filter((q) =>
    format === "mixed" ? true : q.type === format
  );
  const source = pool.length ? pool : QUESTION_BANK;

  return source.map((item, index) => ({
    id: uuid(),
    set_id: setId,
    question_type: item.type,
    stem: item.stem,
    options: item.type === "mcq" ? item.options ?? null : null,
    correct_answer: item.correct_answer,
    confidence: item.confidence,
    source_reference: { upload_id: uploadId, page: (index % 4) + 1 },
    status: "pending_review",
    created_at: new Date().toISOString(),
  }));
}
