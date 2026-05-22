import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { PRINTABLES_ACCESS_COOKIE } from "@/app/lib/printables-access-cookie";

/** Read-only: tells the Kid’s Corner client whether httpOnly unlock cookie exists. */
export async function GET() {
  const jar = await cookies();
  const unlocked = jar.get(PRINTABLES_ACCESS_COOKIE)?.value === "1";
  return NextResponse.json({ unlocked });
}
