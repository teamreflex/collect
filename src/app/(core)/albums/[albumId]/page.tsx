import { cache } from "react"
import { type Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Calendar, Users } from "lucide-react"
import { H2 } from "~/components/typography"
import { siteConfig } from "~/config/site"
import { api } from "~/lib/api/server"
import { cn, formatDate } from "~/lib/utils"
import AlbumRegionIcon from "~/components/album/region-icon"

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
  const name = album?.name ?? "Album"
  return { title: `${name}` }
}

export default async function AlbumPage({ params }: AlbumPageProps) {
  const album = await fetchData(params.albumId)
  if (!album) notFound()

  return (
    <div className="-mt-px min-w-full">
      <div className={cn("mb-5 flex flex-col bg-gradient-to-r", siteConfig.gradient)}>
        <H2 className="text-foreground dark:text-background">
          <div className="container grid grid-cols-1 items-center lg:grid-cols-3">
            <div className="flex justify-start items-center gap-2">
              {album.name}
              <AlbumRegionIcon region={album.region} />
            </div>

            {/* release date */}
            <div className="hidden lg:flex justify-center gap-2 text-lg font-semibold">
              <Calendar /> {formatDate(album.releaseDate.toString())}
            </div>

            {/* artist */}
            <div className="hidden lg:flex justify-end gap-3 text-lg font-semibold">
              <Link
                href={{ pathname: `/artists/${album.artistId}` }}
                className="flex gap-2 underline underline-offset-4"
              >
                <Users /> {album.artist.nameEn}
              </Link>
            </div>
          </div>
        </H2>
      </div>

      <div className="container flex flex-col gap-10">
        {/* album versions */}
        <div className="flex flex-col gap-3">
          <H2>Album Versions</H2>
          <div className="flex flex-row flex-wrap justify-center gap-3">
            {album.versions.map((version) => (
              <p key={`version-${version.id}`}>{version.name}</p>
            ))}
          </div>
        </div>

        {/* photocard sets */}
        <div className="flex flex-col gap-3">
          <H2>Photocard Sets</H2>
          <div className="flex flex-row flex-wrap justify-center gap-3">
            {album.photocardSets.map((set) => (
              <p key={`set-${set.id}`}>{set.name}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export const revalidate = 0
