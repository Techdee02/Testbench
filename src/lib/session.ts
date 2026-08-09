const EMAIL_KEY = "testbench_user_email";
const TOKEN_KEY = "testbench_token";

export function getUserEmail(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(EMAIL_KEY);
}

export function setUserEmail(email: string) {
  window.localStorage.setItem(EMAIL_KEY, email);
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function logout() {
  window.localStorage.removeItem(EMAIL_KEY);
  window.localStorage.removeItem(TOKEN_KEY);
}
