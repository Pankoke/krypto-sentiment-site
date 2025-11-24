import { NextResponse } from "next/server";
import { createAdminSession } from "lib/admin/session";

const SESSION_COOKIE = "admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24; // 1 day

export async function POST(request: Request): Promise<Response> {
  let password: string | undefined;
  try {
    const body = (await request.json()) as { password?: unknown };
    password = typeof body.password === "string" ? body.password : undefined;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const configuredPassword = process.env.ADMIN_PASSWORD;
  if (!configuredPassword) {
    return NextResponse.json({ error: "ADMIN_PASSWORD not configured" }, { status: 500 });
  }

  if (!password || password !== configuredPassword) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const session = await createAdminSession();
  const response = NextResponse.json({ success: true });

  response.cookies.set(SESSION_COOKIE, session.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  return response;
}
