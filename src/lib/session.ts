const KEY = "testbench_user_email";

// No auth endpoint is defined in the Frontend Role PRD's API surface —
// v1 auth is intentionally just enough to persist a session locally.
// Swap this for real cookie/JWT session handling once Backend ships one.
export function getUserEmail(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(KEY);
}

export function setUserEmail(email: string) {
  window.localStorage.setItem(KEY, email);
}

export function clearUserEmail() {
  window.localStorage.removeItem(KEY);
}
