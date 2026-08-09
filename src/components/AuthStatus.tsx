"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserEmail, logout } from "@/lib/session";

export function AuthStatus() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    // One-time hydration from localStorage — unavailable during SSR.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEmail(getUserEmail());
  }, []);

  if (!email) return null;

  return (
    <div className="flex items-center gap-3 text-xs">
      <span className="hidden text-ink-600 sm:inline">{email}</span>
      <button
        type="button"
        onClick={() => {
          logout();
          router.push("/");
        }}
        className="font-display font-bold uppercase tracking-wide text-ink-600 hover:text-danger"
      >
        Log out
      </button>
    </div>
  );
}
