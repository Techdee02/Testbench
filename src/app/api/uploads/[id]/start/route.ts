import { NextRequest, NextResponse } from "next/server";
import { startPipeline, getUpload } from "@/lib/store";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const existing = getUpload(id);
  if (!existing) {
    return NextResponse.json({ error: "upload not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  const practice_mode = body.practice_mode === "timed" ? "timed" : "untimed";
  const question_format = ["mcq", "theory", "mixed"].includes(body.question_format)
    ? body.question_format
    : "mixed";

  const upload = startPipeline(id, practice_mode, question_format);

  // Matches the real backend: no upload_id echoed back here on purpose —
  // callers must already have it from POST /uploads/presign.
  return NextResponse.json({ status: upload!.status }, { status: 202 });
}
