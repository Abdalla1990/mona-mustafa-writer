"use client";

import Image from "next/image";
import { type FormEvent, useEffect, useId, useRef, useState } from "react";

import galleryJson from "@/app/data/printables-gallery.json";
import { MailchimpSignupForm } from "@/app/components/MailchimpSignupForm";

type PrintableItem = {
  id: number;
  title: string;
  thumb: string;
  tag: string;
  url: string;
};

const PRINTABLES = galleryJson as PrintableItem[];

type Tab = "all" | "printables" | "jr";

function itemsFor(active: Tab): PrintableItem[] {
  switch (active) {
    case "printables":
      return PRINTABLES.filter((i) => i.tag.includes("printables"));
    case "jr":
      return PRINTABLES.filter((i) => i.tag.includes("jr"));
    default:
      return PRINTABLES;
  }
}

function tabCls(active: boolean): string {
  if (active) {
    return "rounded-full px-5 py-2 font-serif text-sm font-semibold bg-[var(--color-plum)] text-white shadow transition";
  }
  return "rounded-full px-5 py-2 font-serif text-sm font-semibold border border-[var(--color-forest)]/25 bg-white/75 text-[var(--color-forest)] transition hover:bg-white";
}

export function KidsCornerPrintables() {
  const [access, setAccess] = useState<"loading" | "locked" | "open">("loading");
  const [verificationEnabled, setVerificationEnabled] = useState(false);
  const [tab, setTab] = useState<Tab>("all");
  const unlockId = useId();
  const trapRef = useRef<HTMLInputElement>(null);
  const [unlockEmail, setUnlockEmail] = useState("");
  const [unlockBusy, setUnlockBusy] = useState(false);
  const [unlockErr, setUnlockErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [sess, cfg] = await Promise.all([
          fetch("/api/printables-session").then((r) => r.json()),
          fetch("/api/newsletter-verify").then((r) => r.json()),
        ]);
        if (cancelled) return;
        setAccess(sess.unlocked ? "open" : "locked");
        setVerificationEnabled(Boolean(cfg.verificationEnabled));
      } catch {
        if (!cancelled) setAccess("locked");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onUnlock(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    setUnlockErr(null);
    setUnlockBusy(true);
    try {
      const trapVal = trapRef.current?.value?.trim() ?? "";
      const res = await fetch("/api/newsletter-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: unlockEmail.trim(), trap: trapVal }),
      });
      const raw = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;

      if (res.ok && raw?.ok === true) {
        setAccess("open");
        setUnlockEmail("");
        if (trapRef.current) trapRef.current.value = "";
        return;
      }

      const err = typeof raw?.error === "string" ? raw.error : "";

      if (res.status === 404 || err === "not_found") {
        setUnlockErr(
          "We couldn't find this email yet. Subscribe below first, wait for confirmation from Mailchimp, then try again—or check spelling.",
        );
        return;
      }

      if (res.status === 403 || err === "not_eligible_for_printables_gate") {
        setUnlockErr(
          "Mailchimp has this email, but it is not subscribed or pending confirmation anymore. Subscribe again via the main form.",
        );
        return;
      }

      if (res.status === 501 || err === "verification_unavailable") {
        setUnlockErr(
          "This site has not configured list lookup yet. Subscribe on this device—once Mailchimp accepts you, we'll unlock automatically.",
        );
        return;
      }

      setUnlockErr(err.length > 0 ? err : "Something went wrong. Try again shortly.");
    } finally {
      setUnlockBusy(false);
    }
  }

  if (access === "loading") {
    return (
      <section
        className="mx-auto max-w-3xl px-6 pb-24 sm:px-10"
        aria-busy="true"
        aria-live="polite"
        id="subscribe"
      >
        <div className="sr-only">Loading Kid&apos;s Corner content…</div>
        <div className="mt-4 h-10 w-52 animate-pulse rounded-lg bg-stone-200/80" />
        <div className="mt-6 h-24 max-w-xl animate-pulse rounded-xl bg-stone-200/60" />
        <div className="mt-10 min-h-[20rem] animate-pulse rounded-2xl bg-stone-200/45" />
      </section>
    );
  }

  return (
    <section
      className="mx-auto max-w-3xl px-6 pb-24 sm:px-10"
      id="subscribe"
      aria-labelledby="subscribe-heading"
    >
      <h2
        id="subscribe-heading"
        className="font-serif text-3xl font-semibold text-[var(--color-forest)] sm:text-4xl"
      >
        {access === "open" ? "Printables library" : "Subscribe"}
      </h2>

      {access === "locked" ? (
        <>
          <div className="mt-10">
            <MailchimpSignupForm onSubscribeSuccess={() => setAccess("open")} />
          </div>

          {verificationEnabled ? (
            <div className="mt-12 border-t border-[var(--color-forest)]/10 pt-8">
              <h3 className="font-serif text-xl font-semibold text-[var(--color-forest)]">
                Already on the mailing list?
              </h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-stone-600">
                Enter the same email you hear from on Mailchimp—we&apos;ll look it up and unlock the
                library without subscribing again (requires server configuration).
              </p>
              <form onSubmit={onUnlock} className="relative mt-5 flex max-w-xl flex-col gap-3">
                <input
                  ref={trapRef}
                  tabIndex={-1}
                  type="text"
                  name="_trap_u"
                  defaultValue=""
                  autoComplete="off"
                  aria-hidden
                  className="absolute left-[12000px] h-px w-px opacity-0"
                />
                <label
                  htmlFor={`${unlockId}-email`}
                  className="font-serif text-sm font-bold tracking-wide text-[var(--color-forest)]"
                >
                  Email address
                </label>
                <input
                  id={`${unlockId}-email`}
                  type="email"
                  value={unlockEmail}
                  onChange={(e) => setUnlockEmail(e.target.value)}
                  required
                  disabled={unlockBusy}
                  placeholder="same address as Mona&apos;s newsletters"
                  className="w-full rounded-xl border border-[var(--color-forest)]/20 bg-[var(--color-cream)]/90 px-4 py-3 font-serif text-base font-medium placeholder:text-stone-500 disabled:opacity-70"
                />
                {unlockErr ? (
                  <p className="text-sm leading-relaxed text-red-900" role="alert">
                    {unlockErr}
                  </p>
                ) : null}
                <button
                  type="submit"
                  disabled={unlockBusy}
                  className="inline-flex cursor-pointer items-center justify-center rounded-full bg-[var(--color-plum)] px-8 py-3 text-base font-semibold tracking-wide text-white shadow-[0_12px_30px_-12px_rgba(122,74,117,0.65)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:brightness-100"
                >
                  {unlockBusy ? "Checking…" : "Unlock printables"}
                </button>
              </form>
            </div>
          ) : null}
        </>
      ) : (
        <>
          <nav className="mt-10 flex flex-wrap gap-3" aria-label="Printable filters">
            <button type="button" className={tabCls(tab === "all")} onClick={() => setTab("all")}>
              All materials
            </button>
            <button
              type="button"
              className={tabCls(tab === "printables")}
              onClick={() => setTab("printables")}
            >
              Printables
            </button>
            <button type="button" className={tabCls(tab === "jr")} onClick={() => setTab("jr")}>
              Muslim Jr magazine
            </button>
          </nav>

          <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {itemsFor(tab).map((item) => (
              <li key={item.id}>
                <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--color-forest)]/12 bg-white/70 shadow-sm">
                  <div className="relative aspect-[4/5] w-full">
                    <Image
                      src={`/printables/${item.thumb}`}
                      alt={item.title}
                      fill
                      sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <h3 className="font-serif text-lg font-semibold leading-snug text-[var(--color-ink)]">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--color-forest)] underline-offset-4 hover:underline"
                      >
                        {item.title}
                      </a>
                    </h3>
                    <p className="mt-auto font-serif text-sm text-stone-600">
                      Opens in Google Drive • free download link there
                    </p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
