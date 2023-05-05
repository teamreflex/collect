import { Inter } from "next/font/google";
import "~/styles/globals.css";
import { siteConfig } from "~/config/site";
import { cn } from "~/lib/utils";
import { ClientProviders } from "../client-providers";
import { Toaster } from "~/components/ui/toaster";
import Navbar from "~/components/layout/navbar";

const fontSans = Inter({
  weight: ["400", "500", "600", "800", "900"],
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
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
  metadataBase: new URL(siteConfig.url),
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

export default function CoreLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "antialiased bg-white dark:bg-background text-black dark:text-white h-screen w-screen",
          fontSans.className, siteConfig.gradient
        )}
      >
        <ClientProviders>
          {/* Navbar */}
          <Navbar />

          {/* Content */}
          <main className="m-auto flex flex-col">{children}</main>

          {/* Footer */}
          <footer className={cn("fixed inset-x-0 bottom-0 bg-gradient-to-l", siteConfig.gradient)}>
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
          <Toaster />
        </ClientProviders>
      </body>
    </html>
  );
}
