"use client";

import { type FormEvent, useId, useRef, useState } from "react";

type MailchimpSignupFormProps = {
  onSubscribeSuccess?: () => void;
};

/**
 * Subscribes via `/api/subscribe` so the page never navigates to Mailchimp.
 * Typography matches the rest of the site (Cormorant / Literata).
 */
export function MailchimpSignupForm({ onSubscribeSuccess }: MailchimpSignupFormProps) {
  const formId = useId();
  const trapRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<null | {
    variant: "success" | "error";
    text: string;
  }>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFeedback(null);

    const trapVal = trapRef.current?.value?.trim() ?? "";
    setPending(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          trap: trapVal,
        }),
      });

      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; message?: string; error?: string; outcome?: string }
        | null;

      if (!res.ok || !data || data.ok !== true) {
        setFeedback({
          variant: "error",
          text:
            (data && typeof data.error === "string" && data.error) ||
            "Something went wrong. Please try again.",
        });
        return;
      }

      const extra =
        data.message && String(data.message).length > 0
          ? ` ${String(data.message)}`
          : "";
      let line: string;
      if (data.outcome === "pending") {
        line = `Check your inbox to confirm.${extra}`;
      } else if (data.outcome === "duplicate") {
        line =
          data.message && String(data.message).trim().length > 0
            ? String(data.message).trim()
            : "You're already on the list—your printables are unlocked below.";
      } else {
        line = `You’re subscribed. Thank you!${extra}`;
      }
      setFeedback({
        variant: "success",
        text: line,
      });
      onSubscribeSuccess?.();
      setName("");
      setEmail("");
      if (trapRef.current) trapRef.current.value = "";
    } catch {
      setFeedback({
        variant: "error",
        text: "Network error—check your connection and try again.",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="relative rounded-2xl border border-[var(--color-forest)]/12 bg-white/50 p-8 shadow-sm backdrop-blur-sm sm:p-10">
      <h3 className="font-serif text-2xl font-bold tracking-tight text-[var(--color-forest)] sm:text-[1.65rem]">
        Get your free printables
      </h3>

      <form id={formId} onSubmit={onSubmit} className="mt-8 space-y-6" noValidate>
        <input
          ref={trapRef}
          tabIndex={-1}
          type="text"
          name="_trap"
          defaultValue=""
          autoComplete="off"
          aria-hidden
          className="absolute left-[10000px] top-auto h-px w-px overflow-hidden"
        />

        {feedback ? (
          <div
            role={feedback.variant === "error" ? "alert" : "status"}
            className={`rounded-xl border px-4 py-3 font-serif text-sm font-semibold leading-relaxed ${
              feedback.variant === "success"
                ? "border-[var(--color-forest)]/25 bg-[var(--color-cream)]/95 text-[var(--color-forest)]"
                : "border-red-300/70 bg-red-50/95 text-red-900"
            }`}
          >
            {feedback.text}
          </div>
        ) : null}

        <div className="space-y-2">
          <label
            htmlFor={`${formId}-merge1`}
            className="font-serif text-sm font-bold tracking-wide text-[var(--color-forest)]"
          >
            Name <span className="font-semibold text-stone-600">(required)</span>
          </label>
          <input
            id={`${formId}-merge1`}
            type="text"
            name="MERGE1"
            required
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            placeholder="Your name"
            autoComplete="name"
            disabled={pending}
            className="w-full rounded-xl border border-[var(--color-forest)]/20 bg-[var(--color-cream)]/90 px-4 py-3 font-serif text-base font-medium text-[var(--color-ink)] shadow-inner placeholder:font-medium placeholder:text-stone-500 focus:border-[var(--color-plum)]/45 focus:outline-none focus:ring-2 focus:ring-[var(--color-plum)]/20 disabled:opacity-70"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor={`${formId}-merge0`}
            className="font-serif text-sm font-bold tracking-wide text-[var(--color-forest)]"
          >
            Email address{" "}
            <span className="font-semibold text-stone-600">(required)</span>
          </label>
          <input
            id={`${formId}-merge0`}
            type="email"
            name="MERGE0"
            required
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            disabled={pending}
            className="w-full rounded-xl border border-[var(--color-forest)]/20 bg-[var(--color-cream)]/90 px-4 py-3 font-serif text-base font-medium text-[var(--color-ink)] shadow-inner placeholder:font-medium placeholder:text-stone-500 focus:border-[var(--color-plum)]/45 focus:outline-none focus:ring-2 focus:ring-[var(--color-plum)]/20 disabled:opacity-70"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex cursor-pointer items-center justify-center rounded-full bg-[var(--color-plum)] px-8 py-3.5 text-base font-semibold tracking-wide text-white shadow-[0_12px_30px_-12px_rgba(122,74,117,0.65)] transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-forest)] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:brightness-100"
          >
            {pending ? "Sending…" : "Subscribe"}
          </button>
        </div>
      </form>

    </div>
  );
}
