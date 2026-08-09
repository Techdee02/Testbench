"use client";

import { use, useEffect, useState } from "react";
import { ScreenShell } from "@/components/ScreenShell";
import { LinkButton } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { readResults, StoredResults } from "@/lib/practiceState";

export default function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: sessionId } = use(params);
  const [results, setResults] = useState<StoredResults | null | undefined>(undefined);

  useEffect(() => {
    // One-time hydration from sessionStorage — unavailable during SSR.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setResults(readResults(sessionId));
  }, [sessionId]);

  if (results === undefined) {
    return (
      <ScreenShell narrow>
        <p className="text-ink-600">Loading your results…</p>
      </ScreenShell>
    );
  }

  if (results === null) {
    return (
      <ScreenShell narrow>
        <p className="font-display text-xl font-bold">
          No results to show here.
        </p>
        <LinkButton href="/upload" className="mt-6 inline-block">
          Start a new set
        </LinkButton>
      </ScreenShell>
    );
  }

  const total = results.answers.length;
  const correct = results.answers.filter((a) => a.correct).length;
  const missed = results.answers.filter((a) => !a.correct);
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <ScreenShell>
      <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-forest-700">
        Step 3 of 3 — done
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
        {pct >= 70 ? "Solid session." : "That's the point of practice."}
      </h1>

      <div className="torn-top tilt-2 mt-8 rounded-b-xl bg-forest-900 bg-grain p-8 text-paper shadow-lg">
        <p className="font-display text-5xl font-bold">
          {correct}
          <span className="text-2xl text-mint-200/70"> / {total}</span>
        </p>
        <p className="mt-2 text-mint-200/85">
          {pct}% correct{" "}
          {results.mode === "timed" ? "· timed run" : "· untimed"}
        </p>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-lg font-bold">
          {missed.length === 0
            ? "Nothing missed. Genuinely."
            : `Worth another look (${missed.length})`}
        </h2>
        <div className="mt-4 space-y-4">
          {missed.map(({ question }, i) => (
            <div
              key={question.id + i}
              className="rounded-lg border-2 border-ink-900/10 bg-paper-card p-5"
            >
              <div className="mb-2 flex items-center gap-2">
                <Tag tone="ink">{question.question_type === "mcq" ? "MCQ" : "Theory"}</Tag>
              </div>
              <p className="font-semibold">{question.stem}</p>
              <p className="mt-2 text-sm text-forest-700">
                <span className="font-bold">Correct answer: </span>
                {question.correct_answer ?? "Not available"}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <LinkButton href="/upload">Upload another PQ</LinkButton>
        <LinkButton href="/" variant="secondary">
          Back home
        </LinkButton>
      </div>
    </ScreenShell>
  );
}
