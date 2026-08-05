import { NextRequest, NextResponse } from "next/server";
import { getUpload } from "@/lib/store";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const upload = getUpload(id);
  if (!upload) {
    return NextResponse.json({ error: "upload not found" }, { status: 404 });
  }
  return NextResponse.json(upload);
}
