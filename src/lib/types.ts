export type PracticeMode = "timed" | "untimed";
export type QuestionFormat = "mcq" | "theory" | "mixed";
export type UploadStatus = "uploaded" | "processing" | "ready" | "failed";
export type QuestionType = "mcq" | "theory";
export type Confidence = "high" | "low";
export type QuestionStatus = "pending_review" | "confirmed" | "discarded";

export interface Upload {
  id: string;
  user_id: string;
  file_hash: string | null;
  storage_key: string;
  filename?: string;
  status: UploadStatus;
  practice_mode: PracticeMode | null;
  question_format: QuestionFormat | null;
  // Distinct from `id` by design — only present once status is "ready".
  // GET /sets/:id/questions needs this, not the upload's own id.
  set_id?: string | null;
  created_at: string;
}

export interface SourceReference {
  upload_id?: string;
  page?: number;
}

export interface Question {
  id: string;
  set_id: string;
  question_type: QuestionType;
  stem: string;
  options: string[] | null;
  correct_answer: string | null;
  confidence: Confidence | null;
  source_reference: SourceReference | null;
  status: QuestionStatus;
  created_at: string;
}

export interface PracticeSession {
  id: string;
  set_id: string;
  mode: PracticeMode;
  question_ids: string[];
  created_at: string;
}

export type SetVisibility = "private" | "shared" | "public";

export interface SetVisibilityResponse {
  id: string;
  title: string | null;
  visibility: SetVisibility;
  // Only non-null when visibility is "shared" — null for "private" and
  // "public" (confirmed against the live backend).
  share_token: string | null;
}

// The read-only shape GET /sets/shared/:token returns to non-owners.
// Deliberately missing correct_answer, confidence, and source_reference
// vs. the owner's Question — don't spoil answers or leak review metadata
// to whoever the link gets shared with.
export interface QuestionPublicResponse {
  id: string;
  set_id: string;
  question_type: QuestionType;
  stem: string;
  options: string[] | null;
  status: QuestionStatus;
  created_at: string;
}

export interface DiscoverSetItem {
  id: string;
  title: string | null;
  question_count: number;
  created_at: string;
}

export interface DiscoverSetsResponse {
  items: DiscoverSetItem[];
  page: number;
  page_size: number;
  total: number;
}
