"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
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
      <div className="mb-6 flex items-center justify-between print:hidden">
        <Link href={`/confirm/${setId}`} className="text-sm font-semibold text-forest-700">
          &larr; Back to confirm
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
