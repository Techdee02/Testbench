import { Question } from "@/lib/types";
import { Tag } from "@/components/ui/Tag";

// Used by both the shared-set view and the print view — read-only,
// deliberately shows no correct_answer/confidence/source_reference even
// when they happen to be present (an owner printing their own set still
// gets a no-answers sheet, which is the point of a practice printout).
export function ReadOnlyQuestionList({ questions }: { questions: Question[] }) {
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
              {q.options.map((opt, oi) => (
                <li
                  key={oi}
                  className="rounded-lg border-2 border-ink-900/10 px-3 py-2 text-sm"
                >
                  {opt}
                </li>
              ))}
            </ul>
          )}
          {q.question_type === "theory" && (
            <div className="mt-3 h-16 rounded-lg border-2 border-dashed border-ink-900/15 print:h-24" />
          )}
        </div>
      ))}
    </div>
  );
}
