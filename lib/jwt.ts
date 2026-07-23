import jwt from "jsonwebtoken";
import { AUTH_COOKIE_NAME } from "@/lib/constants";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

if (!JWT_SECRET) {
  throw new Error("Please define the JWT_SECRET environment variable");
}

export interface AuthTokenPayload {
  userId: string;
  role: "patient" | "admin";
}

export function signAuthToken(payload: AuthTokenPayload): string {
  const options: jwt.SignOptions = {
    expiresIn: JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  };
  return jwt.sign(payload, JWT_SECRET as string, options);
}

export function verifyAuthToken(token: string): AuthTokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET as string) as AuthTokenPayload;
  } catch {
    return null;
  }
}

export { AUTH_COOKIE_NAME };
