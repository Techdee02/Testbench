"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { PrintHeader } from "@/components/shared/PrintHeader";
import { ReadOnlyQuestionList } from "@/components/shared/ReadOnlyQuestionList";
import { getQuestions } from "@/lib/api";
import { getToken } from "@/lib/session";
import { Question } from "@/lib/types";

export default function OwnerPrintPage({
  params,
}: {
  params: Promise<{ setId: string }>;
}) {
  const { setId } = use(params);
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[] | null | undefined>(undefined);
  // Owner-only — this is the one print view where correct_answer data
  // actually exists to show. Defaults to off: a printout of your own set
  // is more often "hand this to someone to practice with" than "here's an
  // answer key", and it's easy to flip on when that's what you want.
  const [showAnswers, setShowAnswers] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.replace(`/auth?next=/print/${setId}`);
      return;
    }
    getQuestions(setId)
      .then((qs) => setQuestions(qs.filter((q) => q.status !== "discarded")))
      .catch(() => setQuestions(null));
  }, [setId, router]);

  if (questions === undefined) {
    return <p className="p-8 text-ink-600">Loading…</p>;
  }

  if (questions === null) {
    return (
      <div className="p-8">
        <p className="font-display text-xl font-bold text-danger">
          Couldn&apos;t load this set.
        </p>
        <Link href="/upload" className="mt-4 inline-block text-sm font-semibold text-forest-700">
          Back to upload
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl bg-paper px-6 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href={`/confirm/${setId}`} className="text-sm font-semibold text-forest-700">
          &larr; Back to confirm
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex rounded-full border-2 border-ink-900/15 p-1">
            <button
              type="button"
              onClick={() => setShowAnswers(false)}
              className={`rounded-full px-3 py-1.5 text-xs font-display font-semibold transition-colors ${
                !showAnswers ? "bg-forest-900 text-mint-200" : "text-ink-600"
              }`}
            >
              Questions only
            </button>
            <button
              type="button"
              onClick={() => setShowAnswers(true)}
              className={`rounded-full px-3 py-1.5 text-xs font-display font-semibold transition-colors ${
                showAnswers ? "bg-forest-900 text-mint-200" : "text-ink-600"
              }`}
            >
              Show answers
            </button>
          </div>
          <Button onClick={() => window.print()}>Print</Button>
        </div>
      </div>
      <PrintHeader />
      <h1 className="mb-6 font-display text-2xl font-bold">
        Practice set — {questions.length} question{questions.length === 1 ? "" : "s"}
        {showAnswers && (
          <span className="ml-2 align-middle text-sm font-semibold text-forest-700">
            (with answers)
          </span>
        )}
      </h1>
      <ReadOnlyQuestionList questions={questions} showAnswers={showAnswers} />
    </div>
  );
}
