import {
  PracticeMode,
  Question,
  QuestionFormat,
  Upload,
} from "./types";
import { getToken, logout } from "./session";

// Thin client around the Floater's FastAPI service (Frontend Role PRD,
// Section 04). NEXT_PUBLIC_API_BASE_URL points at the deployed backend;
// leave it unset to fall back to the local /api/* mocks.
const REMOTE_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

function endpoint(path: string) {
  return REMOTE_BASE ? `${REMOTE_BASE}${path}` : `/api${path}`;
}

// Carries the HTTP status so callers can tell a dead resource (404) from a
// transient failure worth retrying, and so a stale token (401) can be
// handled globally instead of at every call site.
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(endpoint(path), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });
  if (res.status === 401) {
    logout();
    if (typeof window !== "undefined") {
      // This module runs outside any component, so there's no router
      // instance to push with — a hard navigation is the only option here.
      const next = encodeURIComponent(window.location.pathname);
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign(`/auth?next=${next}`);
    }
    throw new ApiError(`${init?.method ?? "GET"} ${path} failed: 401`, 401);
  }
  if (!res.ok) {
    throw new ApiError(`${init?.method ?? "GET"} ${path} failed: ${res.status}`, res.status);
  }
  if (res.status === 204 || (res.status === 200 && res.headers.get("content-length") === "0")) {
    return undefined as T;
  }
  return res.json();
}

export function signup(email: string, password: string) {
  return request<{ user_id: string; token: string }>("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function login(email: string, password: string) {
  return request<{ token: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function presignUpload(filename: string, content_type: string) {
  return request<{ upload_url: string; upload_id: string; storage_key: string }>(
    "/uploads/presign",
    { method: "POST", body: JSON.stringify({ filename, content_type }) }
  );
}

// XHR instead of fetch so large scanned bundles can report upload progress —
// fetch has no upload-progress event.
export function putFile(uploadUrl: string, file: File, onProgress?: (pct: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new ApiError(`upload PUT failed: ${xhr.status}`, xhr.status));
    };
    xhr.onerror = () => reject(new ApiError("upload PUT failed: network error", 0));
    xhr.send(file);
  });
}

export function startUpload(
  uploadId: string,
  practice_mode: PracticeMode,
  question_format: QuestionFormat
) {
  return request<{ status: string }>(`/uploads/${uploadId}/start`, {
    method: "POST",
    body: JSON.stringify({ practice_mode, question_format }),
  });
}

export function getUploadStatus(uploadId: string) {
  return request<Upload>(`/uploads/${uploadId}`);
}

export function getQuestions(setId: string) {
  return request<Question[]>(`/sets/${setId}/questions`);
}

// The deployed Floater only persists stem, correct_answer, and status on
// PATCH — there's no options field yet, so MCQ option-text edits stay local
// to the confirm screen until the backend grows one.
export function patchQuestion(id: string, patch: Partial<Question>) {
  const body: Pick<Partial<Question>, "stem" | "correct_answer" | "status"> = {};
  if (patch.stem !== undefined) body.stem = patch.stem;
  if (patch.correct_answer !== undefined) body.correct_answer = patch.correct_answer;
  if (patch.status !== undefined) body.status = patch.status;
  return request<Question>(`/questions/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export function createSession(setId: string, mode: PracticeMode) {
  return request<{ session_id: string; questions: string[] }>("/sessions", {
    method: "POST",
    body: JSON.stringify({ set_id: setId, mode }),
  });
}

export function submitAnswer(
  sessionId: string,
  questionId: string,
  submitted_answer: string
) {
  return request<{ correct: boolean; correct_answer: string | null }>(
    `/sessions/${sessionId}/answers`,
    {
      method: "POST",
      body: JSON.stringify({ question_id: questionId, submitted_answer }),
    }
  );
}
