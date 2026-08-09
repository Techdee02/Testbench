import { PracticeMode, Question, QuestionPublicResponse } from "./types";

// Adapts the read-only public shape (from a share link or Discover) into
// the same Question type the practice/results screens already know how to
// render. correct_answer/confidence/source_reference are genuinely absent
// on QuestionPublicResponse — not an oversight, the backend deliberately
// doesn't hand answers to non-owners — so they're filled with null, which
// every consumer of Question already treats as "not available".
export function publicQuestionToQuestion(pq: QuestionPublicResponse): Question {
  return {
    id: pq.id,
    set_id: pq.set_id,
    question_type: pq.question_type,
    stem: pq.stem,
    options: pq.options,
    correct_answer: null,
    confidence: null,
    source_reference: null,
    status: pq.status as Question["status"],
    created_at: pq.created_at,
  };
}

// The API surface (Frontend Role PRD, Section 04) has no endpoint to
// hydrate a session's full question objects from just a session id — only
// POST /sessions, which returns question ids. So the confirm screen carries
// the already-fetched question objects forward via localStorage, keyed by
// session id, instead of inventing an endpoint that isn't in the contract.
//
// localStorage rather than sessionStorage: a session should survive a
// refresh or the tab being closed and reopened on the same device. True
// cross-device resume would need a GET /sessions/:id endpoint, which the
// backend doesn't have yet.

export interface StoredSession {
  mode: PracticeMode;
  questions: Question[];
}

export interface AnsweredQuestion {
  question: Question;
  submittedAnswer: string;
  correct: boolean;
}

export interface StoredResults {
  mode: PracticeMode;
  answers: AnsweredQuestion[];
}

function sessionKey(id: string) {
  return `tb_session_${id}`;
}

function resultsKey(id: string) {
  return `tb_results_${id}`;
}

export function storeSession(sessionId: string, data: StoredSession) {
  window.localStorage.setItem(sessionKey(sessionId), JSON.stringify(data));
}

export function readSession(sessionId: string): StoredSession | null {
  const raw = window.localStorage.getItem(sessionKey(sessionId));
  return raw ? JSON.parse(raw) : null;
}

export function storeResults(sessionId: string, data: StoredResults) {
  window.localStorage.setItem(resultsKey(sessionId), JSON.stringify(data));
}

export function readResults(sessionId: string): StoredResults | null {
  const raw = window.localStorage.getItem(resultsKey(sessionId));
  return raw ? JSON.parse(raw) : null;
}
