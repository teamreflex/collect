'use client';

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useDebounce } from "usehooks-ts";
import { siteConfig } from "~/config/site";
import { api } from "~/lib/api/client";
import { cn } from "~/lib/utils";
import { H2 } from "../typography";
import ArtistIcon from "./artist-icon";
import AlbumIcon from "./album-icon";
import { type Artist, type Album } from "~/server/db/schema";

export default function ExploreSearch() {
  const [input, setInput] = useState('');
  const debouncedInput = useDebounce(input, 500);

  const [artists, setArtists] = useState<Artist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const { isFetching } = api.explore.search.useQuery(input, {
    enabled: debouncedInput.length >= 2,
    onSuccess(data) {
      setArtists(data.artists ?? []);
      setAlbums(data.albums ?? []);
    },
  });

  function pluralize(count: number, noun: string, suffix = 's') {
    return `${count} ${noun}${count !== 1 ? suffix : ''}`;
  }

  return (
    <div className="relative flex flex-col gap-10 w-full">
      {/* search input */}
      <div>
        <input
          spellCheck={false}
          value={input}
          onChange={e => setInput(e.currentTarget.value)}
          placeholder="Search..."
          className="peer w-full text-xl text-foreground placeholder:text-foreground font-semibold bg-transparent focus:outline-none py-2 pr-12"
        />
        {isFetching && <Loader2 className="absolute right-0 top-0 h-10 w-10 animate-spin" />}
        <span className={cn("block max-w-0 peer-focus:max-w-full duration-300 h-[1px] bg-gradient-to-r", siteConfig.gradient)}></span>
      </div>

      {/* no results */}
      {artists.length === 0 &&albums.length === 0 && !isFetching && debouncedInput.length >= 2 && (
         <H2 className="flex justify-end mt-0">No results</H2>
      )}

      {/* results - artists */}
      {artists.length > 0 && (
        <div className={cn("flex flex-col gap-3", isFetching && 'opacity-50')}>
          <H2 className="flex justify-end">{pluralize(artists.length, "Artist")}</H2>
          <div className="flex flex-row flex-wrap justify-center gap-3">
            {artists.map(artist => <ArtistIcon key={artist.id} artist={artist} size="sm" />)}
          </div>
        </div>
      )}

      {/* results - albums */}
      {albums.length > 0 && (
        <div className={cn("flex flex-col gap-3", isFetching && 'opacity-50')}>
          <H2 className="flex justify-end">{pluralize(albums.length, "Album")}</H2>
          <div className="flex flex-row flex-wrap justify-center gap-3">
            {albums.map(album => <AlbumIcon key={album.id} album={album} size="sm" />)}
          </div>
        </div>
      )}
    </div>
  )
}