import { currentUser } from "@clerk/nextjs/app-beta"
import { type User } from "@clerk/nextjs/dist/api"
import { ArrowBigLeft, Building2, Disc, FileImage, Home, Lock, Users } from "lucide-react"
import AdminNavLink from "~/components/admin/nav-link"

const navigation = [
  { name: "Dashboard", href: "/admin", segment: null, icon: Home },
  { name: "Companies", href: "/admin/companies", segment: "companies", icon: Building2 },
  { name: "Artists", href: "/admin/artists", segment: "artists", icon: Users },
  { name: "Albums", href: "/admin/albums", segment: "albums", icon: Disc },
  { name: "Photocards", href: "/admin/photocards", segment: "photocards", icon: FileImage },
]

export default async function AdminLayout({ children }: PropsWithChildren) {
  const user: User | null = await currentUser()

  if (!user || !user.publicMetadata.admin) {
    return (
      <div className="flex justify-center">
        <Lock />
      </div>
    )
  }

  return (
    <div className="flex w-full grow flex-col gap-y-5 px-6 pt-6 lg:flex-row">
      {/* nav */}
      <nav className="flex flex-col lg:w-1/5">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              <li key="back">
                <AdminNavLink href="/dashboard" segment="dashboard">
                  <ArrowBigLeft className="h-6 w-6 shrink-0" aria-hidden="true" />
                  Back
                </AdminNavLink>
              </li>

              {navigation.map((item) => (
                <li key={item.name}>
                  <AdminNavLink href={item.href} segment={item.segment}>
                    <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                    {item.name}
                  </AdminNavLink>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>

      {/* content */}
      <div className="flex w-full flex-col lg:ml-6 lg:h-4/5">{children}</div>
    </div>
  )
}
