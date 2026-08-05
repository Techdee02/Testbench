import { NextRequest, NextResponse } from "next/server";
import { createUpload } from "@/lib/store";

// Mocks Infra/Backend's presign endpoint. In production this returns a real
// R2 presigned PUT URL; here it points back at our own mock-storage route so
// the upload screen can be built against the exact same contract.
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const filename = typeof body.filename === "string" ? body.filename : "upload";

  const upload = createUpload(filename);

  return NextResponse.json({
    upload_url: `/api/mock-storage/${upload.storage_key}`,
    upload_id: upload.id,
    storage_key: upload.storage_key,
  });
}
