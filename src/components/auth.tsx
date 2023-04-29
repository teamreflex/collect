import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs/app-beta";
import Link from "next/link";

export default function Auth() {
  return (
    <div className="flex flex-row gap-2">
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
      <SignedOut>
        <Link href="/sign-in" className="font-semibold underline underline-offset-4">
          Sign In
        </Link>
      </SignedOut>
    </div>
  )
}