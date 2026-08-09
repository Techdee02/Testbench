"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ScreenShell } from "@/components/ScreenShell";
import { Button } from "@/components/ui/Button";
import { ReadOnlyQuestionList } from "@/components/shared/ReadOnlyQuestionList";
import { ApiError, createSession, getSharedSet } from "@/lib/api";
import { publicQuestionToQuestion, storeSession } from "@/lib/practiceState";
import { PracticeMode, Question } from "@/lib/types";

export default function SharedSetPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[] | null | undefined>(undefined);
  const [mode, setMode] = useState<PracticeMode>("untimed");
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSharedSet(token)
      .then((pqs) => setQuestions(pqs.map(publicQuestionToQuestion)))
      .catch(() => setQuestions(null));
  }, [token]);

  async function handleStartPractice() {
    if (!questions || questions.length === 0) return;
    const setId = questions[0].set_id;
    setStarting(true);
    setError(null);
    try {
      const { session_id, questions: sessionQuestionIds } = await createSession(setId, mode);
      const byId = new Map(questions.map((q) => [q.id, q]));
      const orderedQuestions = sessionQuestionIds
        .map((qid) => byId.get(qid))
        .filter((q): q is Question => Boolean(q));
      storeSession(session_id, { mode, questions: orderedQuestions });
      router.push(`/practice/${session_id}`);
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        setError("The owner hasn't allowed practice sessions from this link.");
      } else {
        setError("Couldn't start a session for this set. Try again in a moment.");
      }
      setStarting(false);
    }
  }

  if (questions === undefined) {
    return (
      <ScreenShell narrow>
        <div className="flex items-center gap-3 text-ink-600">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-forest-900/20 border-t-forest-900" />
          Loading this set…
        </div>
      </ScreenShell>
    );
  }

  if (questions === null) {
    return (
      <ScreenShell narrow>
        <p className="font-display text-xl font-bold text-danger">
          This link isn&apos;t working anymore.
        </p>
        <p className="mt-2 text-ink-600">
          The set may have been unpublished, or the link&apos;s wrong. Ask
          whoever shared it for a fresh one.
        </p>
        <Link href="/" className="mt-6 inline-block">
          <Button variant="secondary">Back home</Button>
        </Link>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell>
      <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-forest-700">
        Shared set
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
        Someone shared this set with you.
      </h1>
      <p className="mt-2 max-w-lg text-ink-600">
        {questions.length} question{questions.length === 1 ? "" : "s"}. Take a
        look, or jump straight into practice.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex gap-3">
          {(["untimed", "timed"] as PracticeMode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`rounded-full border-2 px-5 py-2 font-display font-semibold capitalize transition-colors ${
                mode === m
                  ? "border-forest-900 bg-forest-900 text-mint-200"
                  : "border-ink-900/20 bg-paper-card text-ink-900"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <Button onClick={handleStartPractice} disabled={starting || questions.length === 0}>
          {starting ? "Setting up…" : "Start practising"}
        </Button>
        <Link href={`/shared/${token}/print`}>
          <Button variant="secondary">Print</Button>
        </Link>
      </div>

      {error && <p className="mt-4 text-sm font-semibold text-danger">{error}</p>}

      <div className="mt-8">
        <ReadOnlyQuestionList questions={questions} />
      </div>
    </ScreenShell>
  );
}
