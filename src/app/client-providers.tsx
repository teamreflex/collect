"use client";

import { ClerkProvider } from "@clerk/nextjs/app-beta/client";
import { dark } from "@clerk/themes";
import { env } from "~/env.mjs";
import { api } from "~/lib/api/client";

export function ClientProviders({ children }: PropsWithChildren) {
  return (
    <ClerkProvider publishableKey={env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY} appearance={{
      baseTheme: dark,
    }}>
      <api.Provider>{children}</api.Provider>
    </ClerkProvider>
  );
}
