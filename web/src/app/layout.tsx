import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "@/app/globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "FocusEngine — Self-Hosted Search",
  description:
    "A privacy-first, self-hosted search engine with real-time crawling, typo-tolerant search, and a beautiful admin dashboard.",
  keywords: "search engine, self-hosted, privacy, crawler, meilisearch, focusengine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={spaceGrotesk.variable} style={{ fontFamily: "var(--font-space), 'Space Grotesk', -apple-system, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
