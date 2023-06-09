import AlbumIcon from "~/components/explore/album-icon"
import ArtistIcon from "~/components/explore/artist-icon"
import ExploreSearch from "~/components/explore/search"
import { H2 } from "~/components/typography"
import { siteConfig } from "~/config/site"
import { api } from "~/lib/api/server"
import { cn } from "~/lib/utils"

export const metadata = {
  title: "Explore",
}

export default async function ExplorePage() {
  const { albums, artists } = await api.explore.latest.fetch()

  return (
    <>
      <div
        className={cn(
          "-mt-px mb-5 flex flex-col border-b border-foreground bg-gradient-to-r dark:border-background",
          siteConfig.gradient,
        )}
      >
        <H2 className="flex flex-row border-none dark:border-none">
          <span className="container text-foreground dark:text-background">Explore</span>
        </H2>
      </div>

      <div className="container flex flex-col gap-10">
        {/* search */}
        <ExploreSearch />

        {/* latest artists */}
        <div className="flex flex-col gap-3">
          <H2>Latest Artists</H2>
          <div className="flex flex-row flex-wrap justify-center gap-3">
            {artists.map((artist) => (
              <ArtistIcon key={artist.id} artist={artist} />
            ))}
          </div>
        </div>

        {/* latest albums */}
        <div className="flex flex-col gap-3">
          <H2>Latest Albums</H2>
          <div className="flex flex-row flex-wrap justify-center gap-3">
            {albums.map((album) => (
              <AlbumIcon key={album.id} album={album} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export const revalidate = 3600
