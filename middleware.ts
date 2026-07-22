import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/constants";

/**
 * Route protection at the edge.
 *
 * IMPORTANT: middleware runs on Next.js's Edge runtime, which does not
 * support Node's crypto module, so we can't call jwt.verify() here (that
 * needs the signature check, which requires Node crypto). Instead this
 * middleware does a cheap, unsigned decode purely to decide whether to
 * redirect a visitor away from a page they clearly shouldn't see
 * (fast UX, no database or crypto call). The real, cryptographically
 * verified check always happens again server-side — every API route
 * calls requireAuth()/requireAdmin() from middleware/auth.ts before it
 * does anything with the request. A forged cookie might fool this
 * middleware into rendering a page shell, but it will never pass the
 * verified check that actually returns data, so nothing is exposed.
 */

const PATIENT_ROUTES = ["/book-appointment", "/my-appointments"];
const ADMIN_ROUTES = ["/admin"];
const GUEST_ONLY_ROUTES = ["/login", "/register"];

interface DecodedToken {
  userId: string;
  role: "patient" | "admin";
}

function decodeRole(req: NextRequest): DecodedToken["role"] | null {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    // Unsigned peek at the JWT payload (base64url) — no crypto involved,
    // safe to run on the Edge runtime. This is only used to decide
    // whether to redirect; see the file header for why that's safe.
    const payloadSegment = token.split(".")[1];
    const json = atob(payloadSegment.replace(/-/g, "+").replace(/_/g, "/"));
    const decoded = JSON.parse(json) as DecodedToken;
    return decoded?.role ?? null;
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const role = decodeRole(req);
  const isLoggedIn = role !== null;

  const wantsPatientRoute = PATIENT_ROUTES.some((p) => pathname.startsWith(p));
  const wantsAdminRoute = ADMIN_ROUTES.some((p) => pathname.startsWith(p));
  const wantsGuestOnlyRoute = GUEST_ONLY_ROUTES.some((p) => pathname.startsWith(p));

  if ((wantsPatientRoute || wantsAdminRoute) && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (wantsAdminRoute && role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Already-logged-in users don't need to see login/register again.
  if (wantsGuestOnlyRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/book-appointment/:path*", "/my-appointments/:path*", "/admin/:path*", "/login", "/register"],
};
