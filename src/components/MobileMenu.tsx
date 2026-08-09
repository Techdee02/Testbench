"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUserEmail, logout } from "@/lib/session";

// Small-screen-only: Discover and the logged-in email/log-out live inline
// in the header on sm+, but there's no room for them on a phone. Rather
// than hiding them outright (which is what was happening before — a
// student on mobile had no way to see they were logged in as, or get to
// Discover, at all), they collapse into this menu below sm.
export function MobileMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // One-time hydration from localStorage — unavailable during SSR.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEmail(getUserEmail());
  }, []);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="relative sm:hidden" ref={menuRef}>
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-ink-900/15 text-ink-900"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
          {open ? (
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M4 7h16M4 12h16M4 17h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-56 rounded-xl border-2 border-ink-900/10 bg-paper-card p-2 shadow-xl">
          <Link
            href="/discover"
            onClick={() => setOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm font-semibold text-ink-900 hover:bg-mint-200/40"
          >
            Discover
          </Link>
          <div className="my-1 h-px bg-ink-900/10" />
          {email ? (
            <>
              <p className="truncate px-3 py-1.5 text-xs text-ink-600">{email}</p>
              <button
                type="button"
                onClick={() => {
                  logout();
                  setOpen(false);
                  router.push("/");
                  router.refresh();
                }}
                className="block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-danger hover:bg-danger/10"
              >
                Log out
              </button>
            </>
          ) : (
            <Link
              href="/auth"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-semibold text-ink-900 hover:bg-mint-200/40"
            >
              Log in
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
