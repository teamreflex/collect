import { Inter } from "next/font/google";

import "~/styles/globals.css";
import { siteConfig } from "~/config/site";
import { cn } from "~/lib/utils";

import { ClientProviders } from "./client-providers";
import Link from "next/link";
import Auth from "~/components/auth";
import { Toaster } from "~/components/ui/toaster";
import { Home, PackageOpen, Search, Wrench } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import { currentUser } from "@clerk/nextjs/app-beta";

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

const links = [
  { name: 'Dashboard', icon: Home, href: "/dashboard" },
  { name: 'Collection', icon: PackageOpen, href: "/collection" },
  { name: 'Explore', icon: Search, href: "/explore" },
]

export default async function RootLayout({ children }: PropsWithChildren) {
  const user = await currentUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "antialiased bg-white text-black dark:bg-background dark:text-white",
          fontSans.className
        )}
      >
        <ClientProviders>
          <div className={cn("h-16 bg-gradient-to-r flex items-center", siteConfig.gradient)}>
            <div className="flex container items-center justify-between gap-2 md:gap-4 md:py-6 text-sm">
              <Link
                href="/"
                className="font-semibold underline underline-offset-4 hidden lg:block"
              >
                K-Collect
              </Link>

              <div className="flex flex-row gap-10 justify-start lg:justify-center items-center">
                {links.map((link, i) => (
                  <Tooltip key={i}>
                    <TooltipTrigger asChild>
                      <Link
                        href={link.href}
                        className="hover:drop-shadow-lg hover:border-b-2 border-reflex-400 pb-1"
                      >
                        <link.icon className="h-8 w-8 shrink-0" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>{link.name}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}

                {!!user && user.publicMetadata.admin === true && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href="/admin"
                        className="hover:drop-shadow-lg hover:border-b-2 border-reflex-400 pb-1"
                      >
                        <Wrench className="h-8 w-8 shrink-0" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Admin</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>

              <Auth />
            </div>
          </div>
          <main className="min-h-screen min-w-screen">{children}</main>
          <footer className={cn("bg-gradient-to-l", siteConfig.gradient)}>
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
