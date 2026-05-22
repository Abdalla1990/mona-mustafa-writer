import Image from "next/image";
import { ContactForm } from "./components/ContactForm";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { INSTAGRAM_MONA_URL } from "@/app/lib/external-links";

const PUBLICATIONS = [
  {
    title: "Start with Bismillah",
    subtitle: "Activity book",
    links: [
      { label: "Amazon", href: "https://a.co/d/68XTRYf" },
      { label: "Qunwa", href: "https://qunwa.square.site/product/start-with-bismillah/768" },
      { label: "Activity book (Amazon)", href: "https://a.co/d/aRPSsIQ" },
    ],
  },
];

export default function Home() {
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
      <SiteHeader active="home" />

      <main>
        <section className="mx-auto grid max-w-5xl items-center gap-12 px-6 pb-20 sm:grid-cols-[minmax(0,1fr)_280px] sm:gap-16 sm:px-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="order-2 sm:order-1">
            <p
              className="animate-rise font-[family-name:var(--font-script)] text-4xl text-[var(--color-gold)] sm:text-5xl"
              style={{ fontFamily: "var(--font-script), cursive" }}
            >
              Mona
            </p>
            <h1 className="animate-rise animate-rise-delay-1 font-serif text-4xl font-semibold leading-tight tracking-tight text-[var(--color-ink)] sm:text-5xl lg:text-6xl">
              Mustafa
            </h1>
            <p className="animate-rise animate-rise-delay-2 mt-5 max-w-xl text-lg leading-relaxed text-stone-600 sm:text-xl">
              Mona Mustafa is a homeschooling mother of two and a passionate
              educator with years of teaching experience. Her journey in
              education has inspired her to create enriching materials for
              children, including her most recent book,{" "}
              <em>Start with Bismillah</em>, which was inspired by her
              daughter&apos;s own journey. In her free time, she enjoys gardening
              and kayaking on beautiful summer days in Calgary.
            </p>
            <div className="animate-rise animate-rise-delay-3 mt-8 flex flex-wrap gap-4">
              <a
                href="#publications"
                className="inline-flex rounded-full border border-[var(--color-forest)]/25 bg-white/70 px-6 py-3 text-sm font-semibold text-[var(--color-forest)] shadow-sm backdrop-blur-sm transition hover:border-[var(--color-forest)]/50"
              >
                See publications
              </a>
            </div>
          </div>
          <div className="order-1 flex justify-center sm:order-2 sm:justify-end">
            <div className="animate-rise relative">
              <div
                className="absolute -inset-3 rounded-full bg-gradient-to-br from-[var(--color-gold)]/25 via-transparent to-[var(--color-forest)]/20 blur-2xl"
                aria-hidden
              />
              <div className="relative overflow-hidden rounded-full border border-white/80 shadow-[0_28px_60px_-28px_rgba(30,77,61,0.45)] ring-1 ring-[var(--color-forest)]/10">
                <Image
                  src="/mona-portrait.png"
                  alt="Portrait of Mona Mustafa"
                  width={640}
                  height={800}
                  className="aspect-square w-[min(100%,280px)] max-w-[280px] rounded-full object-cover sm:max-w-[320px] sm:w-[320px]"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        <section id="publications" className="py-20">
          <div className="mx-auto max-w-3xl px-6 sm:px-10">
            <h2 className="font-serif text-3xl font-semibold text-[var(--color-forest)] sm:text-4xl">
              Publications
            </h2>
            <p className="mt-3 text-stone-600">
              Where to find her book today.
            </p>
            <ul className="mt-10 space-y-8">
              {PUBLICATIONS.map((item) => (
                <li
                  key={item.title}
                  className="rounded-2xl border border-[var(--color-forest)]/12 bg-white/70 p-6 shadow-sm sm:p-8"
                >
                  <h3 className="font-serif text-2xl font-semibold text-[var(--color-ink)]">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm uppercase tracking-[0.2em] text-[var(--color-gold)]">
                    {item.subtitle}
                  </p>
                  <ul className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    {item.links.map((link) => (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex w-full items-center justify-center rounded-full border border-[var(--color-forest)]/20 bg-[var(--color-cream)] px-5 py-2.5 text-sm font-semibold text-[var(--color-forest)] transition hover:border-[var(--color-forest)]/40 hover:bg-white sm:w-auto"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          id="contact"
          className="border-t border-[var(--color-forest)]/10 bg-gradient-to-b from-white/30 to-[var(--color-cream)] py-20"
        >
          <div className="mx-auto max-w-3xl px-6 sm:px-10">
            <h2 className="font-serif text-3xl font-semibold text-[var(--color-forest)] sm:text-4xl">
              Say hello
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-stone-700">
              For invitations, questions about her writing, or reader notes—send
              a message. Your email app will open with everything filled in.
            </p>
            <ContactForm />
            <p className="mt-10 text-center text-sm text-stone-500">
              Instagram:&nbsp;
              <a
                href={INSTAGRAM_MONA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[var(--color-plum)] underline-offset-2 hover:underline"
              >
                @monamustafa89
              </a>
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
