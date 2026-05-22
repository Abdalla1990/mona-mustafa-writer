import type { NextResponse } from "next/server";

/** HttpOnly unlock flag — same role as legacy `success=1` cookie, but tighter. */
export const PRINTABLES_ACCESS_COOKIE = "mm_printables_access";

/**
 * Enables the printables gallery for this browser. Not a cryptographic secret;
 * aligns with gated freebies UX (parity with CRA site).
 */
export function grantPrintablesAccess(res: NextResponse) {
  res.cookies.set(PRINTABLES_ACCESS_COOKIE, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}
