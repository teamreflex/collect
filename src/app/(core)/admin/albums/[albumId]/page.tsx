import { cache } from "react"
import { type Metadata } from "next"
import AlbumTable from "~/components/admin/albums/album-table"
import MemberTable from "~/components/admin/members/member-table"
import { H2 } from "~/components/typography"
import { api } from "~/lib/api/server"

type AlbumPageProps = {
  params: {
    albumId: string
  }
}

const fetchData = cache(async (albumId: string) => {
  return await api.albums.fetch.fetch(albumId)
})

export async function generateMetadata({ params }: AlbumPageProps): Promise<Metadata> {
  const album = await fetchData(params.albumId)
  const name = album?.name ?? "Albums"
  return { title: `Admin · ${name}` }
}

export default async function AdminAlbumPage({ params }: AlbumPageProps) {
  const album = await fetchData(params.albumId)

  if (!album) return <H2>Invalid album</H2>

  return (
    <div className="min-w-full">
      <div className="flex flex-col gap-3">
        <H2 className="flex flex-row justify-between">
          {album.name}
          <div className="flex flex-row gap-2"></div>
        </H2>

        <div className="grid grid-cols-1 gap-2 lg:grid-cols-2"></div>
      </div>
    </div>
  )
}

export const revalidate = 60
