import { NextRequest, NextResponse } from "next/server";
import { setSetVisibility } from "@/lib/store";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await request.json().catch(() => ({}));
  const visibility = body.visibility;
  if (!["private", "shared", "public"].includes(visibility)) {
    return NextResponse.json({ detail: "invalid visibility" }, { status: 422 });
  }

  const result = setSetVisibility(id, visibility);
  if (result === null) {
    return NextResponse.json({ error: "set not found" }, { status: 404 });
  }
  if (result === "no_confirmed") {
    return NextResponse.json(
      { detail: "Cannot publish a set with no confirmed questions" },
      { status: 400 }
    );
  }
  return NextResponse.json(result);
}
