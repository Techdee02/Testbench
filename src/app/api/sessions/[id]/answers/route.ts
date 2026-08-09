import { NextRequest, NextResponse } from "next/server";
import { findQuestionById } from "@/lib/store";

// For MCQ, submitted_answer is the chosen option text, checked exactly.
// For theory, there's no auto-grading in v1 (see PRD section 04) — the
// student sees the model answer first, then self-marks by sending
// "correct" or "incorrect" as submitted_answer.
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await context.params;
  const body = await request.json().catch(() => ({}));
  const questionId = typeof body.question_id === "string" ? body.question_id : null;
  const submitted = typeof body.submitted_answer === "string" ? body.submitted_answer : "";

  if (!questionId) {
    return NextResponse.json({ error: "question_id required" }, { status: 400 });
  }

  const question = findQuestionById(questionId);
  if (!question) {
    return NextResponse.json({ error: "question not found" }, { status: 404 });
  }

  const correct =
    question.question_type === "mcq"
      ? submitted.trim() === (question.correct_answer ?? "").trim()
      : submitted.trim().toLowerCase() === "correct";

  return NextResponse.json({ correct, correct_answer: question.correct_answer });
}
