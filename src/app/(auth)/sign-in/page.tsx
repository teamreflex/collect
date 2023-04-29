import { SignIn } from "@clerk/nextjs/app-beta";

export default function Page() {
  return <SignIn afterSignInUrl="/dashboard" signUpUrl="/sign-up" />;
}

export const runtime = "edge";
export const revalidate = 0;
