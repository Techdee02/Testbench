import { Question } from "@/lib/types";
import { Tag } from "@/components/ui/Tag";

// Used by both the shared-set view and the print view — always read-only
// (no editing affordances), but whether answers show is caller-controlled
// via showAnswers. Shared/guest callers never have correct_answer data in
// the first place (the backend withholds it from non-owners on purpose),
// so they simply never pass showAnswers — there's nothing to show either
// way. Only the owner's print view has real answers to reveal.
export function ReadOnlyQuestionList({
  questions,
  showAnswers = false,
}: {
  questions: Question[];
  showAnswers?: boolean;
}) {
  return (
    <div className="space-y-6">
      {questions.map((q, i) => (
        <div
          key={q.id}
          className="rounded-lg border-2 border-ink-900/10 bg-paper-card p-5 print:break-inside-avoid print:border-ink-900/30 print:shadow-none"
        >
          <div className="mb-2 flex items-center gap-2">
            <Tag tone="ink">{i + 1}</Tag>
            <Tag tone="ink">{q.question_type === "mcq" ? "MCQ" : "Theory"}</Tag>
          </div>
          <p className="font-semibold">{q.stem}</p>
          {q.question_type === "mcq" && q.options && (
            <ul className="mt-3 space-y-2">
              {q.options.map((opt, oi) => {
                const isCorrect = showAnswers && opt === q.correct_answer;
                return (
                  <li
                    key={oi}
                    className={`flex items-center justify-between gap-2 rounded-lg border-2 px-3 py-2 text-sm ${
                      isCorrect
                        ? "border-forest-700 bg-mint-200/50 font-semibold text-forest-900"
                        : "border-ink-900/10"
                    }`}
                  >
                    {opt}
                    {isCorrect && (
                      <span className="text-xs font-bold uppercase tracking-wide text-forest-700">
                        Correct
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
          {q.question_type === "theory" &&
            (showAnswers && q.correct_answer ? (
              <div className="mt-3 rounded-lg border-2 border-forest-700/30 bg-mint-200/20 p-3 text-sm">
                <p className="mb-1 text-xs font-bold uppercase tracking-wide text-ink-600">
                  Model answer
                </p>
                {q.correct_answer}
              </div>
            ) : (
              <div className="mt-3 h-16 rounded-lg border-2 border-dashed border-ink-900/15 print:h-24" />
            ))}
        </div>
      ))}
    </div>
  );
}
