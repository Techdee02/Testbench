"use client";

import { useState } from "react";
import { Question } from "@/lib/types";
import { Tag } from "@/components/ui/Tag";

export function QuestionCard({
  question,
  index,
  onChange,
  onDiscard,
  onRestore,
}: {
  question: Question;
  index: number;
  onChange: (patch: Partial<Question>) => void;
  onDiscard: () => void;
  onRestore: () => void;
}) {
  const [stem, setStem] = useState(question.stem);
  const [options, setOptions] = useState(question.options ?? []);
  const [correctAnswer, setCorrectAnswer] = useState(question.correct_answer ?? "");

  const discarded = question.status === "discarded";
  const tilt = ["tilt-1", "tilt-2", "tilt-3", "tilt-4"][index % 4];

  function commitStem() {
    if (stem !== question.stem) onChange({ stem });
  }

  function commitOption(i: number, value: string) {
    const wasCorrect = options[i] === correctAnswer;
    const next = [...options];
    next[i] = value;
    setOptions(next);
    const patch: Partial<Question> = { options: next };
    if (wasCorrect) {
      setCorrectAnswer(value);
      patch.correct_answer = value;
    }
    onChange(patch);
  }

  function selectCorrect(value: string) {
    setCorrectAnswer(value);
    onChange({ correct_answer: value });
  }

  function commitTheoryAnswer() {
    if (correctAnswer !== (question.correct_answer ?? "")) {
      onChange({ correct_answer: correctAnswer });
    }
  }

  return (
    <div
      className={`torn-top ${discarded ? "" : tilt} rounded-b-xl bg-paper-card p-6 shadow-md ring-1 ring-ink-900/10 transition-opacity ${
        discarded ? "opacity-50" : ""
      }`}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Tag tone="ink">{question.question_type === "mcq" ? "MCQ" : "Theory"}</Tag>
          {question.confidence === "low" && (
            <Tag tone="gold">⚑ Low confidence — check this one</Tag>
          )}
          {question.source_reference?.page != null && (
            <span className="text-xs text-ink-600">
              p.{question.source_reference.page}
            </span>
          )}
        </div>
        {discarded ? (
          <button
            onClick={onRestore}
            className="text-xs font-bold uppercase tracking-wide text-forest-700 hover:underline"
          >
            Undo
          </button>
        ) : (
          <button
            onClick={onDiscard}
            className="text-xs font-bold uppercase tracking-wide text-ink-600 hover:text-danger"
          >
            Discard
          </button>
        )}
      </div>

      <textarea
        value={stem}
        onChange={(e) => setStem(e.target.value)}
        onBlur={commitStem}
        disabled={discarded}
        rows={2}
        className="w-full resize-none rounded-lg border-2 border-transparent bg-transparent font-display text-lg font-semibold outline-none focus:border-forest-700/40 disabled:text-ink-600"
      />

      {question.question_type === "mcq" ? (
        <div className="mt-4 space-y-2">
          {options.map((opt, i) => (
            <label
              key={i}
              className={`flex items-center gap-3 rounded-lg border-2 px-3 py-2 ${
                opt === correctAnswer
                  ? "border-forest-700 bg-mint-200/50"
                  : "border-ink-900/10"
              }`}
            >
              <input
                type="radio"
                name={`correct-${question.id}`}
                checked={opt === correctAnswer}
                onChange={() => selectCorrect(opt)}
                disabled={discarded}
              />
              <input
                value={opt}
                onChange={(e) => commitOption(i, e.target.value)}
                disabled={discarded}
                className="flex-1 bg-transparent text-sm outline-none disabled:text-ink-600"
              />
            </label>
          ))}
          <p className="pt-1 text-xs text-ink-600">
            Tap a bubble to mark the correct option.
          </p>
        </div>
      ) : (
        <div className="mt-4">
          <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-ink-600">
            Model answer
          </p>
          <textarea
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            onBlur={commitTheoryAnswer}
            disabled={discarded}
            rows={3}
            className="w-full rounded-lg border-2 border-ink-900/10 bg-paper px-3 py-2 text-sm outline-none focus:border-forest-700/40 disabled:text-ink-600"
          />
        </div>
      )}
    </div>
  );
}
