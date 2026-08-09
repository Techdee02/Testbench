import { NextRequest, NextResponse } from "next/server";
import { listDiscoverSets } from "@/lib/store";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? "1") || 1;
  const pageSize = Number(searchParams.get("page_size") ?? "20") || 20;
  return NextResponse.json(listDiscoverSets(page, pageSize));
}
