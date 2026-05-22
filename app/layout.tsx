import type { Metadata } from "next";
import { Cormorant_Garamond, Literata, Great_Vibes } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-display",
});

const body = Literata({
  subsets: ["latin"],
  variable: "--font-body",
});

const script = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-script",
});

export const metadata: Metadata = {
  title: "Mona Mustafa — Writer",
    description:
      "Homeschooling mother, children's author writing with an Islamic taste—Start with Bismillah and Islamic children's resources for Muslim families. Calgary.",
  openGraph: {
    title: "Mona Mustafa — Writer",
    description:
      "Author of Start with Bismillah—children's materials with Islamic character and remembrance for Muslim families.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${script.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full bg-[var(--color-cream)] text-[var(--color-ink)]">
        {children}
      </body>
    </html>
  );
}
