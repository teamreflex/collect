import AlbumTable from "~/components/admin/albums/album-table"
import { H2 } from "~/components/typography"
import { api } from "~/lib/api/server"

export const metadata = {
  title: "Admin · Albums",
}

export default async function AdminAlbumsPage() {
  const albums = await api.albums.fetchAll.fetch()

  return (
    <div className="min-w-full">
      <div className="flex flex-col gap-3">
        <H2 className="flex flex-row justify-between">Albums</H2>

        <AlbumTable data={albums} />
      </div>
    </div>
  )
}

export const revalidate = 60
