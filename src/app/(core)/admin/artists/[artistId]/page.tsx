import { cache } from "react"
import { type Metadata } from "next"
import Image from "next/image"
import { Headphones } from "lucide-react"
import AlbumTable from "~/components/admin/albums/album-table"
import CreateAlbum from "~/components/admin/albums/create-album"
import DeleteAlbum from "~/components/admin/albums/delete-album"
import UpdateAlbum from "~/components/admin/albums/update-album"
import MemberTable from "~/components/admin/members/member-table"
import { H2 } from "~/components/typography"
import { api } from "~/lib/api/server"

type ArtistPageProps = {
  params: {
    artistId: string
  }
}

const fetchData = cache(async (artistId: string) => {
  return await api.artists.fetch.fetch(artistId)
})

export async function generateMetadata({ params }: ArtistPageProps): Promise<Metadata> {
  const artist = await fetchData(params.artistId)
  const name = artist?.nameEn ?? "Artists"
  return { title: `Admin · ${name}` }
}

export default async function Page({ params }: ArtistPageProps) {
  const artist = await fetchData(params.artistId)

  if (!artist) return <H2>Invalid artist</H2>

  return (
    <div className="min-w-full">
      <div className="flex flex-col gap-3">
        <H2 className="flex flex-row justify-between">
          {artist.nameEn}
          <div className="flex flex-row gap-2"></div>
        </H2>

        <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
          <MemberTable data={artist.members} artist={artist} />
          <AlbumTable data={artist.albums} artist={artist} />
        </div>
      </div>
    </div>
  )
}

export const revalidate = 60
