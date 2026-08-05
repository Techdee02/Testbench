"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ScreenShell } from "@/components/ScreenShell";
import { Button } from "@/components/ui/Button";
import { setUserEmail } from "@/lib/session";

type Mode = "signup" | "login";

function AuthForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/upload";
  const [mode, setMode] = useState<Mode>("signup");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setUserEmail(email);
    router.push(next);
  }

  return (
    <ScreenShell narrow>
      <div className="torn-top tilt-1 rounded-b-xl bg-paper-card p-8 shadow-lg ring-1 ring-ink-900/10">
        <div className="mb-6 inline-flex rounded-full bg-paper-dim p-1">
          {(["signup", "login"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`rounded-full px-4 py-1.5 text-sm font-display font-semibold transition-colors ${
                mode === m
                  ? "bg-forest-900 text-mint-200"
                  : "text-ink-600 hover:text-ink-900"
              }`}
            >
              {m === "signup" ? "Sign up" : "Log in"}
            </button>
          ))}
        </div>

        <h1 className="font-display text-2xl font-bold tracking-tight">
          {mode === "signup" ? "Save your first set." : "Welcome back."}
        </h1>
        <p className="mt-2 text-sm text-ink-600">
          Email only — your question sets and progress follow you between
          your phone and your laptop. No verification email to dig through.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-semibold">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@student.unilag.edu.ng"
              className="w-full rounded-lg border-2 border-ink-900/20 bg-paper px-4 py-3 outline-none focus:border-forest-700"
            />
          </div>
          <Button type="submit" disabled={submitting} className="w-full">
            {mode === "signup" ? "Create account" : "Log in"}
          </Button>
        </form>
      </div>
    </ScreenShell>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <AuthForm />
    </Suspense>
  );
}
