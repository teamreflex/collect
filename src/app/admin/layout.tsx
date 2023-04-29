import { currentUser } from "@clerk/nextjs/app-beta";
import { type User } from "@clerk/nextjs/dist/api";
import { Lock } from "lucide-react";

export default async function Layout({ children }: PropsWithChildren) {
  const user: User | null = await currentUser();

  if (!user || !user.publicMetadata.admin) {
    return <div className="flex justify-center"><Lock /></div>
  }

  return <div>{children}</div>
}