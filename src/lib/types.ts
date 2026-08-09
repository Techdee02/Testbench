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
