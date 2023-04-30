"use client";

import { ClerkProvider } from "@clerk/nextjs/app-beta/client";
import { dark } from "@clerk/themes";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "~/components/ui/tooltip";
import { env } from "~/env.mjs";
import { api } from "~/lib/api/client";

export function ClientProviders({ children }: PropsWithChildren) {
  return (
    <ThemeProvider defaultTheme="dark" attribute="class">
      <ClerkProvider publishableKey={env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY} appearance={{
        baseTheme: dark,
      }}>
        <api.Provider>
          <TooltipProvider delayDuration={100}>{children}</TooltipProvider>
        </api.Provider>
      </ClerkProvider>
    </ThemeProvider>
  );
}
