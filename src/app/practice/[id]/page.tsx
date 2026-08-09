"use client";

import { use, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ScreenShell } from "@/components/ScreenShell";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { submitAnswer } from "@/lib/api";
import {
  AnsweredQuestion,
  readSession,
  storeResults,
  StoredSession,
} from "@/lib/practiceState";

const SECONDS_PER_QUESTION = 50;

function formatClock(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function PracticePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: sessionId } = use(params);
  const router = useRouter();

  const [session, setSession] = useState<StoredSession | null | undefined>(undefined);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  const [lastCorrectAnswer, setLastCorrectAnswer] = useState<string>("");
  const [theoryDraft, setTheoryDraft] = useState("");
  const answersRef = useRef<AnsweredQuestion[]>([]);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const finishedRef = useRef(false);

  useEffect(() => {
    // One-time hydration from sessionStorage — unavailable during SSR, so
    // this can only happen client-side after mount, not as a lazy initializer.
    const stored = readSession(sessionId);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSession(stored);
    if (stored?.mode === "timed") {
      setTimeLeft(stored.questions.length * SECONDS_PER_QUESTION);
    }
  }, [sessionId]);

  const total = session?.questions.length ?? 0;
  const question = session?.questions[index];

  const finish = useMemo(
    () => () => {
      if (finishedRef.current || !session) return;
      finishedRef.current = true;
      storeResults(sessionId, { mode: session.mode, answers: answersRef.current });
      router.replace(`/results/${sessionId}`);
    },
    [session, sessionId, router]
  );

  useEffect(() => {
    if (session?.mode !== "timed" || timeLeft === null) return;
    if (timeLeft <= 0) {
      finish();
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => (s ?? 1) - 1), 1000);
    return () => clearTimeout(t);
  }, [session, timeLeft, finish]);

  if (session === undefined) {
    return (
      <ScreenShell narrow>
        <p className="text-ink-600">Loading your session…</p>
      </ScreenShell>
    );
  }

  if (session === null || !question) {
    return (
      <ScreenShell narrow>
        <p className="font-display text-xl font-bold">
          This session isn&apos;t here anymore.
        </p>
        <p className="mt-2 text-ink-600">
          Sessions live on this device only for now — not synced to your
          account yet. Head back and start a new one.
        </p>
        <Link href="/upload" className="mt-6 inline-block">
          <Button>Back to upload</Button>
        </Link>
      </ScreenShell>
    );
  }

  async function chooseOption(option: string) {
    if (revealed || !question) return;
    setSelected(option);
    const result = await submitAnswer(sessionId, question.id, option);
    answersRef.current.push({
      question,
      submittedAnswer: option,
      correct: result.correct,
    });
    setLastCorrect(result.correct);
    setLastCorrectAnswer(result.correct_answer ?? question.correct_answer ?? "");
    setRevealed(true);
  }

  async function markSelfAssessment(gotItRight: boolean) {
    if (!question) return;
    const result = await submitAnswer(
      sessionId,
      question.id,
      gotItRight ? "correct" : "incorrect"
    );
    answersRef.current.push({
      question,
      submittedAnswer: theoryDraft,
      correct: result.correct,
    });
    setLastCorrect(result.correct);
    setLastCorrectAnswer(result.correct_answer ?? question.correct_answer ?? "");
    setRevealed(true);
  }

  function next() {
    if (index + 1 >= total) {
      finish();
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setRevealed(false);
    setLastCorrect(null);
    setTheoryDraft("");
  }

  return (
    <ScreenShell>
      <div className="mb-6 flex items-center justify-between">
        <p className="font-display text-sm font-bold uppercase tracking-[0.2em] text-forest-700">
          Question {index + 1} of {total}
        </p>
        {session.mode === "timed" && timeLeft !== null && (
          <Tag tone={timeLeft < 30 ? "danger" : "mint"}>
            ⏱ {formatClock(timeLeft)}
          </Tag>
        )}
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-paper-dim">
        <div
          className="h-full rounded-full bg-forest-700 transition-all"
          style={{ width: `${((index + (revealed ? 1 : 0)) / total) * 100}%` }}
        />
      </div>

      <div className="torn-top tilt-1 mt-8 rounded-b-xl bg-paper-card p-7 shadow-lg ring-1 ring-ink-900/10">
        <h2 className="font-display text-xl font-bold leading-snug">
          {question.stem}
        </h2>

        {question.question_type === "mcq" ? (
          <div className="mt-6 space-y-3">
            {(question.options ?? []).map((opt) => {
              const isSelected = selected === opt;
              const isCorrectOpt = opt === question.correct_answer;
              let stateClass = "border-ink-900/15 hover:border-ink-900/30";
              if (revealed) {
                if (isCorrectOpt) stateClass = "border-forest-700 bg-mint-200/60";
                else if (isSelected) stateClass = "border-danger bg-danger/10";
              } else if (isSelected) {
                stateClass = "border-forest-700 bg-mint-200/40";
              }
              return (
                <button
                  key={opt}
                  onClick={() => chooseOption(opt)}
                  disabled={revealed}
                  className={`block w-full rounded-lg border-2 px-4 py-3 text-left text-sm font-medium transition-colors disabled:cursor-default ${stateClass}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {!revealed && (
              <>
                <textarea
                  value={theoryDraft}
                  onChange={(e) => setTheoryDraft(e.target.value)}
                  placeholder="Jot your answer here (optional — this isn't graded automatically)"
                  rows={4}
                  className="w-full rounded-lg border-2 border-ink-900/15 bg-paper px-4 py-3 text-sm outline-none focus:border-forest-700/50"
                />
                <Button
                  variant="secondary"
                  onClick={async () => {
                    setLastCorrectAnswer(question.correct_answer ?? "");
                    setRevealed(true);
                  }}
                >
                  Show the model answer
                </Button>
              </>
            )}
            {revealed && lastCorrect === null && (
              <>
                <div className="rounded-lg border-2 border-forest-700 bg-mint-200/40 p-4 text-sm">
                  <p className="mb-1 font-display font-bold">Model answer</p>
                  {lastCorrectAnswer}
                </div>
                <p className="text-sm font-semibold text-ink-600">
                  Be honest — how did you do?
                </p>
                <div className="flex gap-3">
                  <Button onClick={() => markSelfAssessment(true)}>
                    Got it right
                  </Button>
                  <Button variant="secondary" onClick={() => markSelfAssessment(false)}>
                    Missed it
                  </Button>
                </div>
              </>
            )}
          </div>
        )}

        {revealed && lastCorrect !== null && (
          <div
            className={`mt-6 rounded-lg p-4 text-sm font-semibold ${
              lastCorrect
                ? "bg-mint-200/60 text-forest-900"
                : "bg-danger/10 text-danger"
            }`}
          >
            {lastCorrect ? "Correct." : `Not quite. Correct answer: ${lastCorrectAnswer}`}
          </div>
        )}
      </div>

      {revealed && lastCorrect !== null && (
        <div className="mt-6 flex justify-end">
          <Button onClick={next}>
            {index + 1 >= total ? "See results" : "Next question"}
          </Button>
        </div>
      )}
    </ScreenShell>
  );
}
