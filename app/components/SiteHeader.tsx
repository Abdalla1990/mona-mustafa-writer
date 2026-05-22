import Image from "next/image";
import Link from "next/link";

export type HeaderActive = "home" | "kids";

export function SiteHeader({ active = "home" }: { active?: HeaderActive }) {
  const linkCls = "hover:text-[var(--color-plum)] transition-colors";
  const kidsCls =
    active === "kids"
      ? "text-[var(--color-plum)] underline decoration-[var(--color-gold)] decoration-2 underline-offset-8"
      : "";

  return (
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
        <Link className={linkCls} href="/#publications">
          Work
        </Link>
        <Link href="/kids-corner" className={`${linkCls} ${kidsCls}`}>
          Kid&apos;s Corner
        </Link>
        <Link className={linkCls} href="/#contact">
          Contact
        </Link>
      </nav>
    </header>
  );
}
