"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ReadOnlyQuestionList } from "@/components/shared/ReadOnlyQuestionList";
import { getSharedSet } from "@/lib/api";
import { publicQuestionToQuestion } from "@/lib/practiceState";
import { Question } from "@/lib/types";

export default function SharedSetPrintPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const [questions, setQuestions] = useState<Question[] | null | undefined>(undefined);

  useEffect(() => {
    getSharedSet(token)
      .then((pqs) => setQuestions(pqs.map(publicQuestionToQuestion)))
      .catch(() => setQuestions(null));
  }, [token]);

  if (questions === undefined) {
    return <p className="p-8 text-ink-600">Loading…</p>;
  }

  if (questions === null) {
    return (
      <div className="p-8">
        <p className="font-display text-xl font-bold text-danger">
          This link isn&apos;t working anymore.
        </p>
        <Link href="/" className="mt-4 inline-block text-sm font-semibold text-forest-700">
          Back home
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl bg-paper px-6 py-10">
      <div className="mb-6 flex items-center justify-between print:hidden">
        <Link href={`/shared/${token}`} className="text-sm font-semibold text-forest-700">
          &larr; Back to set
        </Link>
        <Button onClick={() => window.print()}>Print</Button>
      </div>
      <h1 className="mb-6 font-display text-2xl font-bold">
        Practice set — {questions.length} question{questions.length === 1 ? "" : "s"}
      </h1>
      <ReadOnlyQuestionList questions={questions} />
    </div>
  );
}
