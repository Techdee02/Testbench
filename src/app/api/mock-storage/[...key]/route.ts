import { NextRequest, NextResponse } from "next/server";
import { putStorageObject } from "@/lib/store";

// Stands in for the direct-to-R2 PUT. The real upload screen never routes
// files through the app server; this route exists only so the presigned
// URL is something a dev environment without live R2 credentials can hit.
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ key: string[] }> }
) {
  const { key } = await context.params;
  const buffer = await request.arrayBuffer();
  putStorageObject(key.join("/"), key[key.length - 1] ?? "file", buffer.byteLength);
  return new NextResponse(null, { status: 200 });
}
