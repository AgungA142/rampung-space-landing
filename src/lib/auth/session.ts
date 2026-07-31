import { SignJWT, jwtVerify } from "jose";

const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;

export type AdminSessionPayload = {
  id: string;
  email: string;
  full_name: string;
  role: "super_admin" | "admin";
};

export const sessionCookie = {
  name: "admin_session",
  maxAge: SESSION_DURATION_SECONDS,
  options: {
    httpOnly: true as const,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  },
};

function getSecretKey() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("Missing ADMIN_SESSION_SECRET");
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(payload: AdminSessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (
      typeof payload.id === "string" &&
      typeof payload.email === "string" &&
      typeof payload.full_name === "string" &&
      (payload.role === "super_admin" || payload.role === "admin")
    ) {
      return {
        id: payload.id,
        email: payload.email,
        full_name: payload.full_name,
        role: payload.role,
      };
    }
    return null;
  } catch {
    return null;
  }
}
