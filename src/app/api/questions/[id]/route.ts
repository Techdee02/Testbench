import { NextRequest, NextResponse } from "next/server";
import { patchQuestion } from "@/lib/store";
import { Question } from "@/lib/types";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await request.json().catch(() => ({}));

  const patch: Partial<Question> = {};
  if (typeof body.stem === "string") patch.stem = body.stem;
  if (Array.isArray(body.options)) patch.options = body.options;
  if (typeof body.correct_answer === "string") patch.correct_answer = body.correct_answer;
  if (body.status === "confirmed" || body.status === "discarded" || body.status === "pending_review") {
    patch.status = body.status;
  }

  const updated = patchQuestion(id, patch);
  if (!updated) {
    return NextResponse.json({ error: "question not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}
