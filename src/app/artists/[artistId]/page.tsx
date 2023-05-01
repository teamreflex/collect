import { type Metadata } from "next";
import { cache } from "react";
import { H2 } from "~/components/typography"
import { siteConfig } from "~/config/site";
import { cn } from "~/lib/utils";
import { fetchArtistWithContent } from "~/server/db/artists";

type ArtistPageProps = {
  params: {
    artistId: string;
  }
}

const fetchData = cache(async (artistId: string) => {
  return await fetchArtistWithContent(artistId);
});

export async function generateMetadata({ params }: ArtistPageProps): Promise<Metadata> {
  const artist = await fetchData(params.artistId);
  const name = artist?.nameEn ?? 'Artist'
  return { title: `${name}` }
}

export default async function Page({ params }: ArtistPageProps) {
  const artist = await fetchData(params.artistId);

  if (!artist) return <H2>Invalid artist</H2>

  return (
    <div className="min-w-full">
      <div className={cn("flex flex-col mb-5 bg-gradient-to-r", siteConfig.gradient)}>
        <H2 className="flex flex-row">
          <span className="container">{artist.nameEn}</span>
        </H2>
      </div>

      <div className="container">
        <div className="flex flex-col gap-3">
          <p>Members: {artist.members.length}</p>
          <p>Albums: {artist.albums.length}</p>
        </div>
      </div>
    </div>
  )
}

export const runtime = "edge";