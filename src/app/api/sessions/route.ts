import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const setId = typeof body.set_id === "string" ? body.set_id : null;
  const mode = body.mode === "timed" ? "timed" : "untimed";

  if (!setId) {
    return NextResponse.json({ error: "set_id required" }, { status: 400 });
  }

  const session = createSession(setId, mode);

  return NextResponse.json(
    { session_id: session.id, questions: session.question_ids },
    { status: 201 }
  );
}
