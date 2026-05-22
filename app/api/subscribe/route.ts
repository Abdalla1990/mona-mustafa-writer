import { NextResponse } from "next/server";

import {
  MAILCHIMP_LIST_ID,
  MAILCHIMP_POST_JSON,
  MAILCHIMP_U,
} from "@/app/lib/external-links";
import { grantPrintablesAccess } from "@/app/lib/printables-access-cookie";

/** Mailchimp post-json replies with JSON wrapped in `callback(...)`. */
function parseMailchimpJsonp(payload: string) {
  const t = payload.trim();
  const open = t.indexOf("(");
  const close = t.lastIndexOf(")");
  if (open === -1 || close <= open + 1) {
    throw new Error("Could not parse Mailchimp response");
  }
  const jsonSlice = t.slice(open + 1, close);
  return JSON.parse(jsonSlice) as {
    result: string;
    msg?: string;
  };
}

function sanitizeMailchimpMessage(msg: string | undefined) {
  if (!msg) return "";
  const stripped = msg.replace(/^-?\d+\s*-\s*/, "").trim();
  return stripped || msg.trim();
}

function flattenMailchimpMsg(msgUnknown: unknown) {
  return String(msgUnknown ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function looksLikeDuplicateSubscriber(mailchimpMsg: unknown) {
  const s = flattenMailchimpMsg(mailchimpMsg);
  return (
    s.includes("already subscribed") ||
    s.includes("already a list member") ||
    s.includes("already a subscriber") ||
    (s.includes("subscriber") && s.includes("already")) ||
    (s.includes("signup") && s.includes("duplicate"))
  );
}

/** JSON payload + Mailchimp success cookie (mirrors CRA `success=1` behaviour). */
function subscribeSuccessNextResponse(payload: Record<string, unknown>) {
  const res = NextResponse.json(payload);
  grantPrintablesAccess(res);
  return res;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ ok: false, error: "Invalid body." }, { status: 400 });
  }

  const b = body as Record<string, unknown>;

  if (typeof b.email !== "string" || typeof b.name !== "string") {
    return NextResponse.json({ ok: false, error: "Name and email are required." }, { status: 400 });
  }

  const trap = typeof b.trap === "string" ? b.trap : "";
  if (trap.trim() !== "") {
    return NextResponse.json({ ok: false, error: "Submission rejected." }, { status: 400 });
  }

  const email = b.email.trim();
  const name = b.name.trim();
  if (name.length < 1 || name.length > 200) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid name (1–200 characters)." },
      { status: 400 },
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
  }

  const params = new URLSearchParams({
    u: MAILCHIMP_U,
    id: MAILCHIMP_LIST_ID,
    MERGE0: email,
    MERGE1: name,
    c: "__mcCb",
  });

  let text: string;
  try {
    const res = await fetch(`${MAILCHIMP_POST_JSON}?${params}`, {
      method: "GET",
      cache: "no-store",
      headers: {
        Accept: "*/*",
        "User-Agent": "mona-mustafa-newsletter-proxy/1.0",
      },
    });
    text = await res.text();
    if (!res.ok) {
      console.error("[subscribe] Mailchimp HTTP:", res.status, text.slice(0, 200));
      return NextResponse.json(
        { ok: false, error: "Mailchimp was unavailable—try again in a minute." },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("[subscribe] Mailchimp fetch failed:", err);
    return NextResponse.json(
      { ok: false, error: "Could not reach Mailchimp—check your connection and try again." },
      { status: 502 },
    );
  }

  let parsed: { result: string; msg?: string };
  try {
    parsed = parseMailchimpJsonp(text);
  } catch (err) {
    console.error("[subscribe] Could not parse JSONP:", err, text.slice(0, 300));
    return NextResponse.json(
      { ok: false, error: "Unexpected response from Mailchimp." },
      { status: 502 },
    );
  }

  const result = parsed.result?.toLowerCase() ?? "";

  /**
   * `success`: subscribed.
   * `pending`: confirmation / GDPR flow (still OK for UX).
   * `noop` / variants: occasional no-op replies for existing subs (treat softly).
   */
  if (
    result === "success" ||
    result === "pending" ||
    result === "noop"
  ) {
    return subscribeSuccessNextResponse({
      ok: true,
      message: sanitizeMailchimpMessage(parsed.msg),
      outcome: parsed.result,
    });
  }

  if (result === "error" && looksLikeDuplicateSubscriber(parsed.msg)) {
    const friendly =
      sanitizeMailchimpMessage(parsed.msg) ||
      "You’re already subscribed—your printables are unlocked below.";
    return subscribeSuccessNextResponse({
      ok: true,
      outcome: "duplicate",
      message: friendly,
    });
  }

  return NextResponse.json(
    {
      ok: false,
      error:
        sanitizeMailchimpMessage(parsed.msg) ||
        "Subscribe did not succeed. Please check your email and try again.",
    },
    { status: 400 },
  );
}
