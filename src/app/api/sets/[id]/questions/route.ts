import { NextRequest, NextResponse } from "next/server";
import { getQuestions } from "@/lib/store";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const questions = getQuestions(id);
  if (!questions) {
    return NextResponse.json({ error: "set not found or not ready" }, { status: 404 });
  }
  return NextResponse.json(questions);
}
