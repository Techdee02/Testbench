"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { LinkButton } from "@/components/ui/Button";
import { MobileMenu } from "@/components/MobileMenu";
import { getUserEmail, logout } from "@/lib/session";

export function Nav() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    // One-time hydration from localStorage — unavailable during SSR.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEmail(getUserEmail());
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-paper/90 backdrop-blur border-b-2 border-ink-900/10">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Logo tone="ink" className="h-8 w-8" />
          <span className="font-display text-xl font-bold tracking-tight">
            Testbench
          </span>
        </Link>
        <nav className="flex items-center gap-3">
          <Link
            href="/discover"
            className="hidden text-sm font-semibold text-ink-900 hover:text-forest-700 sm:inline"
          >
            Discover
          </Link>
          {email ? (
            <>
              <span className="hidden text-sm text-ink-600 sm:inline">{email}</span>
              <button
                type="button"
                onClick={() => {
                  logout();
                  router.push("/");
                  router.refresh();
                }}
                className="hidden text-sm font-semibold text-ink-900 hover:text-danger sm:inline"
              >
                Log out
              </button>
              <LinkButton href="/upload" className="px-5 py-2.5 text-sm">
                Go to upload
              </LinkButton>
            </>
          ) : (
            <>
              <Link
                href="/auth"
                className="hidden sm:inline text-sm font-semibold text-ink-900 hover:text-forest-700"
              >
                Log in
              </Link>
              <LinkButton href="/upload" className="px-5 py-2.5 text-sm">
                Get started
              </LinkButton>
            </>
          )}
          <MobileMenu />
        </nav>
      </div>
    </header>
  );
}
