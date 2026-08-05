"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ScreenShell } from "@/components/ScreenShell";
import { Button } from "@/components/ui/Button";
import { QuestionCard } from "@/components/confirm/QuestionCard";
import { getQuestions, getUploadStatus, patchQuestion, createSession } from "@/lib/api";
import { PracticeMode, Question } from "@/lib/types";
import { storeSession } from "@/lib/practiceState";

export default function ConfirmPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [mode, setMode] = useState<PracticeMode>("untimed");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([getQuestions(id), getUploadStatus(id)])
      .then(([qs, upload]) => {
        setQuestions(qs);
        setMode(upload.practice_mode ?? "untimed");
      })
      .catch(() => setError("Couldn't load this set. Try refreshing."));
  }, [id]);

  function updateLocal(questionId: string, patch: Partial<Question>) {
    setQuestions((prev) =>
      prev
        ? prev.map((q) => (q.id === questionId ? { ...q, ...patch } : q))
        : prev
    );
  }

  async function handleFieldChange(questionId: string, patch: Partial<Question>) {
    updateLocal(questionId, patch);
    try {
      await patchQuestion(questionId, patch);
    } catch {
      setError("A change didn't save. Check your connection and try again.");
    }
  }

  async function handleStartPractice() {
    if (!questions) return;
    setSubmitting(true);
    setError(null);
    try {
      const toConfirm = questions.filter((q) => q.status === "pending_review");
      await Promise.all(
        toConfirm.map((q) => patchQuestion(q.id, { status: "confirmed" }))
      );
      const { session_id, questions: sessionQuestionIds } = await createSession(id, mode);
      const byId = new Map<string, Question>(
        questions.map((q) => [q.id, { ...q, status: "confirmed" as Question["status"] }])
      );
      const orderedQuestions: Question[] = sessionQuestionIds
        .map((qid) => byId.get(qid))
        .filter((q): q is Question => Boolean(q));
      storeSession(session_id, { mode, questions: orderedQuestions });
      router.push(`/practice/${session_id}`);
    } catch {
      setError("Couldn't start the session. Try again in a moment.");
      setSubmitting(false);
    }
  }

  if (error && !questions) {
    return (
      <ScreenShell narrow>
        <p className="font-display text-xl font-bold text-danger">{error}</p>
      </ScreenShell>
    );
  }

  if (!questions) {
    return (
      <ScreenShell narrow>
        <div className="flex items-center gap-3 text-ink-600">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-forest-900/20 border-t-forest-900" />
          Loading your questions…
        </div>
      </ScreenShell>
    );
  }

  const active = questions.filter((q) => q.status !== "discarded");
  const lowConfidenceCount = active.filter((q) => q.confidence === "low").length;

  return (
    <ScreenShell>
      <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-forest-700">
        Step 2 of 3
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
        Confirm your questions.
      </h1>
      <p className="mt-2 max-w-lg text-ink-600">
        This is your set now. Edit anything that&apos;s off, discard what
        isn&apos;t worth keeping.
        {lowConfidenceCount > 0 && (
          <>
            {" "}
            We flagged{" "}
            <strong className="text-ink-900">
              {lowConfidenceCount} question{lowConfidenceCount > 1 ? "s" : ""}
            </strong>{" "}
            worth a closer look.
          </>
        )}
      </p>

      <div className="mt-8 space-y-6">
        {active.length === 0 && (
          <p className="text-ink-600">
            Everything&apos;s discarded. Undo one below, or head back and
            upload something else.
          </p>
        )}
        {questions.map((q, i) => (
          <QuestionCard
            key={q.id}
            question={q}
            index={i}
            onChange={(patch) => handleFieldChange(q.id, patch)}
            onDiscard={() => handleFieldChange(q.id, { status: "discarded" })}
            onRestore={() => handleFieldChange(q.id, { status: "pending_review" })}
          />
        ))}
      </div>

      {error && <p className="mt-4 text-sm font-semibold text-danger">{error}</p>}

      <div className="sticky bottom-6 mt-10 flex justify-center">
        <Button
          onClick={handleStartPractice}
          disabled={submitting || active.length === 0}
          className="shadow-xl"
        >
          {submitting ? "Setting up your session…" : `Start practising · ${active.length} questions`}
        </Button>
      </div>
    </ScreenShell>
  );
}
