"use client"

import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { Home, PackageOpen, Search, Wrench } from "lucide-react"
import { siteConfig } from "~/config/site"
import { cn } from "~/lib/utils"

import Auth from "../auth"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

const links = [
  { name: "Dashboard", icon: Home, href: "/dashboard" },
  { name: "Collection", icon: PackageOpen, href: "/collection" },
  { name: "Explore", icon: Search, href: "/explore" },
]

export default function Navbar() {
  const { user, isLoaded } = useUser()

  return (
    <div
      className={cn(
        "flex h-16 items-center border-b border-foreground bg-gradient-to-r dark:border-none",
        siteConfig.gradient,
      )}
    >
      <div className="container flex items-center justify-between gap-2 text-sm text-foreground dark:text-background md:gap-4 md:py-6">
        <Link
          href={{ pathname: "/" }}
          className="hidden font-semibold underline underline-offset-4 lg:block"
          aria-label="Home"
        >
          K-Collect
        </Link>

        <div className="flex flex-row items-center justify-start gap-10 lg:justify-center">
          {links.map((link, i) => (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <Link
                  href={{ pathname: link.href }}
                  className="border-reflex-400 pb-1 drop-shadow-lg hover:border-b-2"
                  aria-label={link.name}
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
                  className="border-reflex-400 pb-1 drop-shadow-lg hover:border-b-2"
                  aria-label="Admin"
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

        <Auth signedIn={!!user} loaded={isLoaded} />
      </div>
    </div>
  )
}
