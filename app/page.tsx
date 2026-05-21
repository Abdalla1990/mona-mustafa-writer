import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "./components/ContactForm";

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
      <header className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-6 py-8 sm:px-10">
        <Link
          href="/"
          className="animate-rise block w-44 shrink-0 overflow-hidden rounded-3xl ring-1 ring-[var(--color-forest)]/10 sm:w-52"
        >
          <Image
            src="/mona-logo.png"
            alt="Mona Mustafa"
            width={520}
            height={200}
            className="h-auto w-full rounded-3xl object-contain"
            priority
          />
        </Link>
        <nav className="animate-rise animate-rise-delay-1 flex flex-wrap items-center justify-end gap-x-6 gap-y-2 text-sm font-medium tracking-wide text-[var(--color-forest)] sm:gap-8">
          <a className="hover:text-[var(--color-plum)]" href="#about">
            About
          </a>
          <a className="hover:text-[var(--color-plum)]" href="#publications">
            Work
          </a>
          <a className="hover:text-[var(--color-plum)]" href="#contact">
            Contact
          </a>
        </nav>
      </header>

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
              Writer crafting warm, faith-rooted stories for families and young
              readers—beginning with thoughtful books you can hold in your
              hands.
            </p>
            <div className="animate-rise animate-rise-delay-3 mt-8 flex flex-wrap gap-4">
              <a
                href="#publications"
                className="inline-flex rounded-full border border-[var(--color-forest)]/25 bg-white/70 px-6 py-3 text-sm font-semibold text-[var(--color-forest)] shadow-sm backdrop-blur-sm transition hover:border-[var(--color-forest)]/50"
              >
                See publications
              </a>
              <a
                href="https://linktr.ee/Mona.Mustafa"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-full px-6 py-3 text-sm font-semibold text-[var(--color-plum)] underline-offset-4 hover:underline"
              >
                Link in bio
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

        <section
          id="about"
          className="border-t border-[var(--color-forest)]/10 bg-white/40 py-20 backdrop-blur-[2px]"
        >
          <div className="mx-auto max-w-3xl px-6 sm:px-10">
            <h2 className="font-serif text-3xl font-semibold text-[var(--color-forest)] sm:text-4xl">
              A few words
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-stone-700">
              Mona is an emerging author sharing stories shaped by care,
              curiosity, and everyday faith. Her debut activity book,{" "}
              <em>Start with Bismillah</em>, invites children into gentle
              routines and joyful learning—meant to be read, colored, and lived
              together at home.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-stone-700">
              This space is intentionally small: a calm corner of the internet
              where you can browse her work and reach out directly.
            </p>
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
              Prefer socials?{" "}
              <a
                href="https://linktr.ee/Mona.Mustafa"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[var(--color-plum)] underline-offset-2 hover:underline"
              >
                @Mona.Mustafa on Linktree
              </a>
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--color-forest)]/10 py-10 text-center text-sm text-stone-500">
        <p>© {new Date().getFullYear()} Mona Mustafa. All rights reserved.</p>
      </footer>
    </div>
  );
}
