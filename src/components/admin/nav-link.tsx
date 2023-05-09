"use client"

import { type ReactNode } from "react"
import Link from "next/link"
import { useSelectedLayoutSegment } from "next/navigation"
import { cn } from "~/lib/utils"

export default function AdminNavLink({
  children,
  href,
  segment,
}: {
  children: ReactNode
  href: string
  segment: string | null
}) {
  const currentSegment = useSelectedLayoutSegment()

  return (
    <Link
      href={{ pathname: href }}
      className={cn(
        currentSegment === segment
          ? "bg-slate-800 text-white"
          : "text-gray-400 hover:bg-slate-800 hover:text-white",
        "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
      )}
    >
      {children}
    </Link>
  )
}
