import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import { Providers } from "@/app/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Shelfed Bookstore — a bookstore, mostly",
    template: "%s · Shelfed Bookstore",
  },
  description:
    "A curated online bookstore. Staff picks, mood shelves, and new arrivals — browsed like a real shop, ordered over UPI and WhatsApp.",
  openGraph: {
    title: "Shelfed Bookstore",
    description: "A curated online bookstore, browsed like a real shop.",
    url: siteUrl,
    siteName: "Shelfed Bookstore",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shelfed Bookstore",
    description: "A curated online bookstore, browsed like a real shop.",
  },
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <body>
        <Providers>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-spine focus:text-paper-soft focus:px-4 focus:py-2 focus:rounded-sm"
          >
            Skip to content
          </a>
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
