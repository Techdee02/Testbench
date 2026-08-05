import {
  PracticeMode,
  Question,
  QuestionFormat,
  Upload,
} from "./types";

// Thin client around the API surface in Section 04 of the Frontend Role
// PRD. Talks to our local mock routes today; swapping NEXT_PUBLIC_API_BASE_URL
// to the real Floater service later requires no changes here.
const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    throw new Error(`${init?.method ?? "GET"} ${path} failed: ${res.status}`);
  }
  if (res.status === 204 || res.status === 200 && res.headers.get("content-length") === "0") {
    return undefined as T;
  }
  return res.json();
}

export function presignUpload(filename: string, content_type: string) {
  return request<{ upload_url: string; upload_id: string; storage_key: string }>(
    "/api/uploads/presign",
    { method: "POST", body: JSON.stringify({ filename, content_type }) }
  );
}

export async function putFile(uploadUrl: string, file: File) {
  const res = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type || "application/octet-stream" },
  });
  if (!res.ok) throw new Error(`upload PUT failed: ${res.status}`);
}

export function startUpload(
  uploadId: string,
  practice_mode: PracticeMode,
  question_format: QuestionFormat
) {
  return request<{ upload_id: string; status: string }>(
    `/api/uploads/${uploadId}/start`,
    { method: "POST", body: JSON.stringify({ practice_mode, question_format }) }
  );
}

export function getUploadStatus(uploadId: string) {
  return request<Upload>(`/api/uploads/${uploadId}`);
}

export function getQuestions(setId: string) {
  return request<Question[]>(`/api/sets/${setId}/questions`);
}

export function patchQuestion(id: string, patch: Partial<Question>) {
  return request<Question>(`/api/questions/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

export function createSession(setId: string, mode: PracticeMode) {
  return request<{ session_id: string; questions: string[] }>("/api/sessions", {
    method: "POST",
    body: JSON.stringify({ set_id: setId, mode }),
  });
}

export function submitAnswer(
  sessionId: string,
  questionId: string,
  submitted_answer: string
) {
  return request<{ correct: boolean; correct_answer: string }>(
    `/api/sessions/${sessionId}/answers`,
    {
      method: "POST",
      body: JSON.stringify({ question_id: questionId, submitted_answer }),
    }
  );
}
