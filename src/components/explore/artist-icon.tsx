import Image from "next/image";
import Link from "next/link";
import { cn } from "~/lib/utils";
import { type Artist } from "~/server/db/schema"

type Props = {
  artist: Artist;
  size?: 'sm' | 'default';
}

export default function ArtistIcon({ artist, size = 'default' }: Props) {
  return (
    <Link aria-label={artist.nameEn} href={{ pathname: `/artists/${artist.id}` }} className={cn("relative overflow-hidden group shadow-md", size === 'default' ? 'rounded-[3rem] w-64 h-64' : 'rounded-2xl w-32 h-32')}>
      <Image alt={artist.nameEn} src={artist.image} fill={true} className="absolute object-cover z-30" />
      <div className="relative z-40 p-2 flex justify-center items-center h-full invisible transition ease-in-out duration-300 bg-transparent group-hover:bg-background/50 group-hover:visible">
        <p className={cn("text-center font-semibold drop-shadow", size === 'default' ? 'text-3xl' : 'text-lg')}>{artist.nameEn}</p>
      </div>
    </Link>
  )
}