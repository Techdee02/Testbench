import { PracticeMode, Question } from "./types";

// The API surface (Frontend Role PRD, Section 04) has no endpoint to
// hydrate a session's full question objects from just a session id — only
// POST /sessions, which returns question ids. So the confirm screen carries
// the already-fetched question objects forward via sessionStorage, keyed by
// session id, instead of inventing an endpoint that isn't in the contract.

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
  window.sessionStorage.setItem(sessionKey(sessionId), JSON.stringify(data));
}

export function readSession(sessionId: string): StoredSession | null {
  const raw = window.sessionStorage.getItem(sessionKey(sessionId));
  return raw ? JSON.parse(raw) : null;
}

export function storeResults(sessionId: string, data: StoredResults) {
  window.sessionStorage.setItem(resultsKey(sessionId), JSON.stringify(data));
}

export function readResults(sessionId: string): StoredResults | null {
  const raw = window.sessionStorage.getItem(resultsKey(sessionId));
  return raw ? JSON.parse(raw) : null;
}
