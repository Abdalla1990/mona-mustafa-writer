"use client";

import { FormEvent, useState } from "react";

const TO_EMAIL = "mona.mustafa023@gmail.com";

export function ContactForm() {
  const [hint, setHint] = useState<string | null>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const message = String(fd.get("message") ?? "").trim();

    if (!name || !email || !message) {
      setHint("Please fill in every field before sending.");
      return;
    }

    setHint(null);
    const subject = encodeURIComponent(`Message from ${name} (writer website)`);
    const body = encodeURIComponent(
      `${message}\n\n—\n${name}\n${email}`,
    );
    window.location.href = `mailto:${TO_EMAIL}?subject=${subject}&body=${body}`;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 flex flex-col gap-5 rounded-2xl border border-[var(--color-forest)]/15 bg-white/80 p-6 shadow-[0_20px_50px_-24px_rgba(30,77,61,0.35)] backdrop-blur-sm sm:p-8"
      noValidate
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium text-[var(--color-ink)]">
          Name
          <input
            name="name"
            type="text"
            autoComplete="name"
            className="rounded-xl border border-[var(--color-forest)]/20 bg-[var(--color-cream)]/50 px-4 py-3 text-base text-[var(--color-ink)] outline-none ring-[var(--color-plum)] transition placeholder:text-stone-400 focus:border-[var(--color-plum)]/40 focus:ring-2"
            placeholder="Your name"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-[var(--color-ink)]">
          Email
          <input
            name="email"
            type="email"
            autoComplete="email"
            className="rounded-xl border border-[var(--color-forest)]/20 bg-[var(--color-cream)]/50 px-4 py-3 text-base text-[var(--color-ink)] outline-none ring-[var(--color-plum)] transition placeholder:text-stone-400 focus:border-[var(--color-plum)]/40 focus:ring-2"
            placeholder="you@example.com"
          />
        </label>
      </div>
      <label className="flex flex-col gap-2 text-sm font-medium text-[var(--color-ink)]">
        Message
        <textarea
          name="message"
          rows={5}
          className="resize-y rounded-xl border border-[var(--color-forest)]/20 bg-[var(--color-cream)]/50 px-4 py-3 text-base text-[var(--color-ink)] outline-none ring-[var(--color-plum)] transition placeholder:text-stone-400 focus:border-[var(--color-plum)]/40 focus:ring-2"
          placeholder="Say hello, ask about collaborations, or share a kind note."
        />
      </label>
      {hint ? (
        <p className="text-sm text-amber-800" role="status">
          {hint}
        </p>
      ) : null}
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-full bg-[var(--color-plum)] px-8 py-3.5 text-base font-semibold tracking-wide text-white shadow-[0_12px_30px_-12px_rgba(122,74,117,0.65)] transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-forest)]"
      >
        Send email
      </button>
      <p className="text-xs leading-relaxed text-stone-500">
        Opens your email app with this message addressed to Mona. If nothing
        happens, check that a default mail program is set on your device.
      </p>
    </form>
  );
}
