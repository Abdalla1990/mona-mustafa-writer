import { createHash } from "node:crypto";

import { NextResponse } from "next/server";

import { MAILCHIMP_LIST_ID } from "@/app/lib/external-links";
import { grantPrintablesAccess } from "@/app/lib/printables-access-cookie";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET() {
  return NextResponse.json({
    verificationEnabled: Boolean(process.env.MAILCHIMP_API_KEY?.trim()),
  });
}

function subscriberHash(email: string) {
  return createHash("md5").update(email.trim().toLowerCase()).digest("hex");
}

/** Marketing API subdomain from key suffix `...-us21` or explicit `MAILCHIMP_DC=us21`. */
function mailchimpDataCenter(apiKey: string): string {
  const last = apiKey.trim().split("-").pop() ?? "";
  if (/^(us|eu)\d+$/i.test(last)) return last.toLowerCase();
  throw new Error("Could not derive Mailchimp data center");
}

/** Optional: verify membership server-side — set `MAILCHIMP_API_KEY` (and optionally `MAILCHIMP_DC`). */
export async function POST(request: Request) {
  const key = process.env.MAILCHIMP_API_KEY?.trim();
  if (!key) {
    return NextResponse.json(
      {
        ok: false,
        error: "verification_unavailable",
      },
      { status: 501 },
    );
  }

  let dc: string;
  try {
    dc =
      process.env.MAILCHIMP_DC?.trim().toLowerCase() ?? mailchimpDataCenter(key);
  } catch {
    return NextResponse.json(
      { ok: false, error: "verification_unconfigured" },
      { status: 501 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }
  const rec = body as Record<string, unknown>;
  if (typeof rec.email !== "string") {
    return NextResponse.json({ ok: false, error: "email_required" }, { status: 400 });
  }

  const trap = typeof rec.trap === "string" ? rec.trap : "";
  if (trap.trim() !== "") {
    return NextResponse.json({ ok: false, error: "submission_rejected" }, { status: 400 });
  }

  const email = rec.email.trim();
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  const hash = subscriberHash(email);
  const url = `https://${dc}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members/${hash}`;

  let resMc: Response;
  try {
    resMc = await fetch(url, {
      method: "GET",
      cache: "no-store",
      headers: {
        Authorization: `Basic ${Buffer.from(`any:${key}`, "utf8").toString("base64")}`,
      },
    });
  } catch (err) {
    console.error("[newsletter-verify] fetch failed:", err);
    return NextResponse.json({ ok: false, error: "upstream_failed" }, { status: 502 });
  }

  if (resMc.status === 404) {
    return NextResponse.json(
      { ok: false, error: "not_found" },
      { status: 404 },
    );
  }

  if (!resMc.ok) {
    const errText = await resMc.text();
    console.error("[newsletter-verify] Mailchimp HTTP:", resMc.status, errText.slice(0, 300));
    return NextResponse.json({ ok: false, error: "mailchimp_error" }, { status: 502 });
  }

  const member = (await resMc.json()) as { status?: string };
  const stRaw = typeof member.status === "string" ? member.status : "";
  const st = stRaw.toLowerCase();

  if (!stRaw) {
    return NextResponse.json({ ok: false, error: "missing_status" }, { status: 502 });
  }

  if (st === "subscribed" || st === "pending") {
    const out = NextResponse.json({
      ok: true,
      membershipStatus: member.status,
    });
    grantPrintablesAccess(out);
    return out;
  }

  return NextResponse.json(
    {
      ok: false,
      error: "not_eligible_for_printables_gate",
      membershipStatus: member.status,
    },
    { status: 403 },
  );
}