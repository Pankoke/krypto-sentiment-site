import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { destroyAdminSession } from "lib/admin/session";

const SESSION_COOKIE = "admin_session";

export async function POST(): Promise<Response> {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value ?? null;

  await destroyAdminSession(token);

  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
