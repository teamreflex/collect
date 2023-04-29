import { Inter } from "next/font/google";

import "~/styles/globals.css";
import { siteConfig } from "~/config/site";
import { cn } from "~/lib/utils";

import { ClientProviders } from "./client-providers";
import Link from "next/link";
import Auth from "~/components/auth";

const fontSans = Inter({
  weight: ["400", "500", "600", "800", "900"],
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ['kpop', 'collection', 'photocard', 'album', 'trading'],
  authors: [
    {
      name: "Reflex",
      url: siteConfig.links.github,
    },
  ],
  creator: "Reflex",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: "@Reflexgg",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
};

type RootLayoutProps = PropsWithChildren;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head />
      <ClientProviders>
        <body
          className={cn(
            "antialiased bg-white text-black dark:bg-slate-900 dark:text-white",
            fontSans.className
          )}
        >
          <div className="h-16 mb-3 bg-gradient-to-r from-rose-100 to-teal-100 dark:from-rose-100/80 dark:to-teal-100/80 text-slate-900 flex items-center">
            <div className="flex container items-center justify-between gap-2 md:gap-4 md:py-6 text-sm">
              <Link
                href="/"
                className="font-semibold underline underline-offset-4"
              >
                K-Collect
              </Link>

              <Auth />
            </div>
          </div>
          <main className="min-h-screen container">{children}</main>
          <footer className="bg-gradient-to-l from-rose-100 to-teal-100 dark:from-rose-100/80 dark:to-teal-100/80 text-slate-900">
            <div className="grid md:flex container md:items-center md:justify-between gap-2 md:gap-4 py-3 md:py-6 text-sm">
              <p>
                Source code is available on{" "}
                <a
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold underline underline-offset-4"
                >
                  GitHub
                </a>
              </p>
            </div>
          </footer>
        </body>
      </ClientProviders>
    </html >
  );
}
