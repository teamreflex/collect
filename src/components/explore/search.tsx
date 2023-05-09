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

export default function ExploreSearch() {
  const [input, setInput] = useState('');
  const debouncedInput = useDebounce(input, 500);

  const { data, isFetching } = api.explore.search.useQuery(debouncedInput, {
    keepPreviousData: true,
    enabled: debouncedInput.length >= 2,
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
      {data?.artists.length === 0 && data.albums.length === 0 && !isFetching && debouncedInput.length >= 2 && (
         <H2 className="flex justify-end mt-0">No results</H2>
      )}

      {/* results - artists */}
      {data?.artists && data.artists.length > 0 && (
        <div className={cn("flex flex-col gap-3", isFetching && 'opacity-50')}>
          <H2 className="flex justify-end">{pluralize(data.artists.length, "Artist")}</H2>
          <div className="flex flex-row flex-wrap justify-center gap-3">
            {data.artists.map(artist => <ArtistIcon key={artist.id} artist={artist} size="sm" />)}
          </div>
        </div>
      )}

      {/* results - albums */}
      {data?.albums && data.albums.length > 0 && (
        <div className={cn("flex flex-col gap-3", isFetching && 'opacity-50')}>
          <H2 className="flex justify-end">{pluralize(data.albums.length, "Album")}</H2>
          <div className="flex flex-row flex-wrap justify-center gap-3">
            {data.albums.map(album => <AlbumIcon key={album.id} album={album} size="sm" />)}
          </div>
        </div>
      )}
    </div>
  )
}