import type { NextRequest } from "next/server";
import { sessionCookie, verifySessionToken, type AdminSessionPayload } from "./session";

export async function requireAdmin(request: NextRequest): Promise<AdminSessionPayload | null> {
  const token = request.cookies.get(sessionCookie.name)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
