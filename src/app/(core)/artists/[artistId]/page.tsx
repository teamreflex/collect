import { cache } from "react"
import { type Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Building2, Calendar } from "lucide-react"
import AlbumCard from "~/components/artist/album-card"
import LikeArtist from "~/components/artist/like-artist"
import { H2 } from "~/components/typography"
import { siteConfig } from "~/config/site"
import { api } from "~/lib/api/server"
import { cn, formatDate } from "~/lib/utils"

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
  const name = artist?.nameEn ?? "Artist"
  return { title: `${name}` }
}

export default async function ArtistPage({ params }: ArtistPageProps) {
  const artist = await fetchData(params.artistId)
  if (!artist) notFound()

  return (
    <div className="-mt-px min-w-full">
      <div className={cn("mb-5 flex flex-col bg-gradient-to-r", siteConfig.gradient)}>
        <H2 className="text-foreground dark:text-background">
          <div className="container grid grid-cols-2 items-center lg:grid-cols-3">
            <div className="flex justify-start gap-2">
              {artist.nameEn}
              <LikeArtist artist={artist} />
            </div>

            {/* debut */}
            <div className="hidden justify-center gap-2 text-lg font-semibold lg:flex">
              <Calendar /> {formatDate(artist.debut.getDate())}
            </div>

            {/* company */}
            <div className="flex justify-end gap-3 text-lg font-semibold">
              <Link
                href={{ pathname: `/companies/${artist.companyId}` }}
                className="hidden gap-2 underline underline-offset-4 lg:flex"
              >
                <Building2 /> {artist.company.nameEn}
              </Link>
            </div>
          </div>
        </H2>
      </div>

      <div className="container">
        <div className="flex flex-row flex-wrap gap-3">
          {artist.albums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      </div>
    </div>
  )
}

export const revalidate = 60
