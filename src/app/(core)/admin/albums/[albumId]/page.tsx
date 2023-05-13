import { cache } from "react"
import { type Metadata } from "next"
import AlbumPhotocardSetList from "~/components/admin/albums/photocard-set-list"
import AlbumVersionsList from "~/components/admin/albums/versions-list"
import { H2, H3, H4 } from "~/components/typography"
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
          <div className="flex items-baseline gap-2">
            {album.name}
            <H4>{album.artist.nameEn}</H4>
          </div>
          <div className="flex flex-row gap-2"></div>
        </H2>

        <div className="flex flex-col gap-2">
          <H3>Album Versions</H3>
          <AlbumVersionsList album={album} />
        </div>

        <div className="flex flex-col gap-2">
          <H3>Photocard Sets</H3>
          <AlbumPhotocardSetList album={album} />
        </div>
      </div>
    </div>
  )
}

export const revalidate = 60
