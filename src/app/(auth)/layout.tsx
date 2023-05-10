import { Inter } from "next/font/google"

import "~/styles/globals.css"
import { siteConfig } from "~/config/site"
import { cn } from "~/lib/utils"

import { ClientProviders } from "../client-providers"

export * from "~/config/metadata"

const fontSans = Inter({
  weight: ["400", "500", "600", "800", "900"],
  subsets: ["latin"],
})

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
