"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PrintHeader } from "@/components/shared/PrintHeader";
import { ReadOnlyQuestionList } from "@/components/shared/ReadOnlyQuestionList";
import { getPublicSetQuestions } from "@/lib/api";
import { Question } from "@/lib/types";

export default function DiscoverSetPrintPage({
  params,
}: {
  params: Promise<{ setId: string }>;
}) {
  const { setId } = use(params);
  const [questions, setQuestions] = useState<Question[] | null | undefined>(undefined);

  useEffect(() => {
    getPublicSetQuestions(setId)
      .then(setQuestions)
      .catch(() => setQuestions(null));
  }, [setId]);

  if (questions === undefined) {
    return <p className="p-8 text-ink-600">Loading…</p>;
  }

  if (questions === null) {
    return (
      <div className="p-8">
        <p className="font-display text-xl font-bold text-danger">
          This set isn&apos;t available anymore.
        </p>
        <Link href="/discover" className="mt-4 inline-block text-sm font-semibold text-forest-700">
          Back to Discover
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl bg-paper px-6 py-10">
      <div className="mb-6 flex items-center justify-between print:hidden">
        <Link href={`/discover/${setId}`} className="text-sm font-semibold text-forest-700">
          &larr; Back to set
        </Link>
        <Button onClick={() => window.print()}>Print</Button>
      </div>
      <PrintHeader />
      <h1 className="mb-6 font-display text-2xl font-bold">
        Practice set — {questions.length} question{questions.length === 1 ? "" : "s"}
      </h1>
      {/* No answers toggle — a public/Discover fetch never carries
          correct_answer, so there's nothing for one to reveal here. */}
      <ReadOnlyQuestionList questions={questions} />
    </div>
  );
}
