import { Inter } from "next/font/google"

import "~/styles/globals.css"
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

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "h-screen w-screen bg-white text-black antialiased dark:bg-background dark:text-white",
          fontSans.className,
          siteConfig.gradient,
        )}
      >
        <ClientProviders>
          {/* Content */}
          <main
            className={cn(
              "flex h-full w-full items-center justify-center bg-gradient-to-r",
              siteConfig.gradient,
            )}
          >
            <div className="flex flex-col justify-center">{children}</div>
          </main>
        </ClientProviders>
      </body>
    </html>
  )
}
