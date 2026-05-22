import type { Metadata } from "next";
import Link from "next/link";

import { KidsCornerPrintables } from "@/app/components/KidsCornerPrintables";
import { SiteFooter } from "@/app/components/SiteFooter";
import { SiteHeader } from "@/app/components/SiteHeader";
import { INSTAGRAM_MONA_URL } from "@/app/lib/external-links";

export const metadata: Metadata = {
  title: "Kid's Corner • Free Printables | Mona Mustafa",
  description:
    "Subscribe via Mailchimp to unlock Mona Mustafa's Kid's Corner printables library—files open from Google Drive, with optional list updates for Muslim families.",
};

function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01" />
    </svg>
  );
}

export default function KidsCornerPage() {
  return (
    <div className="relative isolate min-h-full overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35]"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(184,149,47,0.12), transparent), radial-gradient(ellipse 60% 40% at 100% 0%, rgba(30,77,61,0.08), transparent)",
        }}
      />

      <SiteHeader active="kids" />

      <main>
        <section className="mx-auto max-w-3xl px-6 pb-16 sm:px-10">
          <p
            className="animate-rise font-[family-name:var(--font-script)] text-4xl text-[var(--color-gold)] sm:text-5xl"
            style={{ fontFamily: "var(--font-script), cursive" }}
          >
            Mona
          </p>
          <h1 className="animate-rise animate-rise-delay-1 font-serif text-4xl font-semibold leading-tight tracking-tight text-[var(--color-ink)] sm:text-5xl">
            Mustafa
          </h1>
          <p className="animate-rise animate-rise-delay-2 mt-4 text-lg leading-relaxed text-stone-600 sm:text-xl">
            Free printables, newsletter signup, and a little room to say hello—a
            page for any Muslim families drawn to Islamic-centered children&apos;s
            materials, whether you homeschool or not.
          </p>

          <div className="animate-rise animate-rise-delay-3 mt-8 flex flex-wrap items-center gap-4 border-t border-[var(--color-forest)]/10 pt-8">
            <a
              href={INSTAGRAM_MONA_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Mona Mustafa on Instagram (@monamustafa89)"
              className="inline-flex items-center gap-3 rounded-full border border-[var(--color-forest)]/20 bg-white/70 px-5 py-2.5 text-sm font-semibold text-[var(--color-forest)] shadow-sm backdrop-blur-sm transition hover:border-[var(--color-forest)]/40 hover:bg-white"
            >
              <InstagramGlyph className="h-6 w-6 text-[var(--color-plum)]" />
              <span>@monamustafa89</span>
            </a>
            <Link
              href="/"
              className="text-sm font-medium text-[var(--color-plum)] underline-offset-4 hover:underline"
            >
              Writer homepage &amp; publications
            </Link>
          </div>
        </section>

        <KidsCornerPrintables />
      </main>

      <SiteFooter />
    </div>
  );
}
