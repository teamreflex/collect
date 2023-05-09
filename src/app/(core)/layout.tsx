import { Inter } from "next/font/google"

import "~/styles/globals.css"
import Navbar from "~/components/layout/navbar"
import ThemeToggle from "~/components/layout/theme-toggle"
import { Toaster } from "~/components/ui/toaster"
import { siteConfig } from "~/config/site"
import { cn } from "~/lib/utils"

import { ClientProviders } from "../client-providers"

const fontSans = Inter({
  weight: ["400", "500", "600", "800", "900"],
  subsets: ["latin"],
})

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["kpop", "collection", "photocard", "album", "trading"],
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
}

export default function CoreLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "max-w-screen h-screen bg-white text-black antialiased dark:bg-background dark:text-white",
          fontSans.className,
          siteConfig.gradient,
        )}
      >
        <ClientProviders>
          {/* Navbar */}
          <Navbar />

          {/* Content */}
          <main className="m-auto mb-5 flex min-h-[calc(100vh-9.25rem)] min-w-full flex-col text-foreground">
            {children}
          </main>

          {/* Footer */}
          <footer
            className={cn(
              "relative inset-x-0 bottom-0 z-50 border-t border-foreground bg-gradient-to-l dark:border-background",
              siteConfig.gradient,
            )}
          >
            <div className="container flex h-16 flex-row justify-between py-5 text-sm text-foreground dark:text-background md:items-center">
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

              <ThemeToggle />
            </div>
          </footer>
          <Toaster />
        </ClientProviders>
      </body>
    </html>
  )
}
