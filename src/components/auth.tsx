'use client';

import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { LogIn } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

type Props = {
  signedIn: boolean;
}

export default function Auth({ signedIn }: Props) {
  return (
    <div className="flex flex-row gap-2">
      {signedIn && <UserButton afterSignOutUrl="/" />}
      {!signedIn && (
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
      )}
    </div>
  )
}