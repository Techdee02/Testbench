import { NextRequest, NextResponse } from "next/server";
import { getSetByShareToken } from "@/lib/store";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ token: string }> }
) {
  const { token } = await context.params;
  const questions = getSetByShareToken(token);
  if (!questions) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json(questions);
}
