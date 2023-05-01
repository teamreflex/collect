'use client'
import { useSelectedLayoutSegment } from "next/navigation"
import { type ReactNode } from "react"
import { cn } from "~/lib/utils"

export default function AdminNavLink({ children, href, segment }: { children: ReactNode, href: string, segment: string | null }) {
  const currentSegment = useSelectedLayoutSegment();

  return (
    <a
      href={href}
      className={cn(
        currentSegment === segment ? 'bg-slate-800 text-white' : 'text-gray-400 hover:text-white hover:bg-slate-800',
        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
      )}
    >
      {children}
    </a>
  )
}