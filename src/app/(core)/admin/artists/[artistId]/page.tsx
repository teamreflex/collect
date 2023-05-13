import { cache } from "react"
import { type Metadata } from "next"
import AlbumTable from "~/components/admin/artists/album-table"
import MemberTable from "~/components/admin/artists/member-table"
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

export default async function AdminArtistPage({ params }: ArtistPageProps) {
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
