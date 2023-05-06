import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import AlbumCard from "~/components/artist/album-card";
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

  if (!artist) notFound();

  return (
    <div className="min-w-full">
      <div className={cn("flex flex-col mb-5 bg-gradient-to-r", siteConfig.gradient)}>
        <H2 className="flex flex-row">
          <span className="container">{artist.nameEn}</span>
        </H2>
      </div>

      <div className="container">
        <div className="flex flex-row flex-wrap gap-3">
          {artist.albums.map(album => <AlbumCard key={album.id} album={album} />)}
        </div>
      </div>
    </div>
  )
}

export const runtime = "edge";
export const revalidate = 60;