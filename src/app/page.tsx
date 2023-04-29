import { SignedIn, SignedOut } from "@clerk/nextjs/app-beta";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex items-center justify-center">
      <SignedIn>
        <Link href="/dashboard" className="underline underline-offset-4">Dashboard</Link>
      </SignedIn>

      <SignedOut>
        soon
      </SignedOut>
    </div>
  );
}

export const runtime = "edge";
export const revalidate = 0;
