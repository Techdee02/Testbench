import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const email = typeof body.email === "string" ? body.email : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!email || !password) {
    return NextResponse.json({ error: "email and password required" }, { status: 422 });
  }

  const user = createUser(email, password);
  if (!user) {
    return NextResponse.json({ error: "account already exists" }, { status: 409 });
  }

  return NextResponse.json({ user_id: user.id, token: user.token }, { status: 201 });
}
