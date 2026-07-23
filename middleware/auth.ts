import { NextRequest } from "next/server";
import { AuthTokenPayload, verifyAuthToken } from "@/lib/jwt";
import { AUTH_COOKIE_NAME } from "@/lib/constants";

export function getAuthUser(req: NextRequest): AuthTokenPayload | null {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAuthToken(token);
}

export function requireAuth(req: NextRequest): AuthTokenPayload | null {
  return getAuthUser(req);
}

export function requireAdmin(req: NextRequest): AuthTokenPayload | null {
  const user = getAuthUser(req);
  if (!user || user.role !== "admin") return null;
  return user;
}
