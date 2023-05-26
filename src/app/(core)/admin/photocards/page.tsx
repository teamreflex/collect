import PhotocardTable from "~/components/admin/photocards/photocard-table"
import { H2 } from "~/components/typography"
import { api } from "~/lib/api/server"

export const metadata = {
  title: "Admin · Photocards",
}

export default async function AdminPhotocardsPage() {
  const photocards = await api.photocards.fetchAll.fetch()

  return (
    <div className="min-w-full">
      <div className="flex flex-col gap-3">
        <H2 className="flex flex-row justify-between text-foreground">Photocards</H2>

        <PhotocardTable data={photocards} />
      </div>
    </div>
  )
}

export const revalidate = 60
