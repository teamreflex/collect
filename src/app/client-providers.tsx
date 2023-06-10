"use client"

import { ClerkProvider } from "@clerk/nextjs/app-beta/client"
import { dark } from "@clerk/themes"
import { ThemeProvider } from "next-themes"
import { TooltipProvider } from "~/components/ui/tooltip"
import { env } from "~/env.mjs"
import { api } from "~/lib/api/client"
import { useHydrateAtoms } from 'jotai/utils'
import { likesAtom } from "~/hooks/use-likes"

type Props = PropsWithChildren & {
  likes: number[]
}

export function ClientProviders({ children, likes }: Props) {
  useHydrateAtoms([[likesAtom, likes]])

  return (
    <ThemeProvider defaultTheme="dark" attribute="class">
      <ClerkProvider
        publishableKey={env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
        appearance={{
          baseTheme: dark,
          elements: {
            card: "bg-foreground/50 dark:bg-background/50 border-transparent",
            formFieldInput: "bg-background/50",
            formButtonReset: "text-reflex-400 hover:text-white hover:bg-reflex-300",
            formButtonPrimary: "bg-reflex-400 hover:bg-reflex-300",
            footerActionLink: "text-reflex-400 hover:text-reflex-300",
            profileSectionPrimaryButton: "text-reflex-400",
            badge: "text-reflex-400",
            userButtonBox: "drop-shadow",
          },
        }}
      >
        <api.Provider>
          <TooltipProvider delayDuration={100}>{children}</TooltipProvider>
        </api.Provider>
      </ClerkProvider>
    </ThemeProvider>
  )
}
