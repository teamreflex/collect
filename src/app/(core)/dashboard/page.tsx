import { PartyPopper } from "lucide-react"

export const metadata = {
  title: "Dashboard",
}

export default function Page() {
  return (
    <div className="mt-6 flex items-center justify-center">
      <PartyPopper />
    </div>
  )
}

export const runtime = "edge"
export const revalidate = 0
