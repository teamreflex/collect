import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs/app-beta";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { LogIn } from "lucide-react";

export default function Auth() {
  return (
    <div className="flex flex-row gap-2">
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
      <SignedOut>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/sign-in"
              className="hover:drop-shadow-lg hover:border-b-2 border-reflex-400 pb-1"
            >
              <LogIn className="h-8 w-8 shrink-0" />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Sign In</p>
          </TooltipContent>
        </Tooltip>
      </SignedOut>
    </div>
  )
}