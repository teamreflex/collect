'use client';

import { useUser } from "@clerk/nextjs";
import { Home, PackageOpen, Search, Wrench } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "~/config/site";
import { cn } from "~/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import Auth from "../auth";

const links = [
  { name: 'Dashboard', icon: Home, href: "/dashboard" },
  { name: 'Collection', icon: PackageOpen, href: "/collection" },
  { name: 'Explore', icon: Search, href: "/explore" },
]

export default function Navbar() {
  const { user, isLoaded } = useUser();

  return (
    <div className={cn("h-16 bg-gradient-to-r flex items-center border-b border-foreground dark:border-none", siteConfig.gradient)}>
      <div className="container flex items-center justify-between gap-2 md:gap-4 md:py-6 text-sm text-foreground dark:text-background">
        <Link
          href={{ pathname: "/" }}
          className="font-semibold underline underline-offset-4 hidden lg:block"
          aria-label="Home"
        >
          K-Collect
        </Link>

        <div className="flex flex-row gap-10 justify-start lg:justify-center items-center">
          {links.map((link, i) => (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <Link
                  href={{ pathname: link.href }}
                  className="drop-shadow-lg hover:border-b-2 border-reflex-400 pb-1"
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
                  className="drop-shadow-lg hover:border-b-2 border-reflex-400 pb-1"
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
  );
}