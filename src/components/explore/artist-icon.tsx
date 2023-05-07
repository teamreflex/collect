import Image from "next/image";
import Link from "next/link";
import { type Artist } from "~/server/db/schema"

type Props = {
  artist: Artist;
}

export default function ArtistIcon({ artist }: Props) {
  return (
    <Link href={{ pathname: `/artists/${artist.id}` }} className="relative overflow-hidden group rounded-[3rem] w-64 h-64">
      <Image alt={artist.nameEn} src={artist.image} fill={true} className="absolute object-cover z-30" />
      <div className="relative z-40 p-2 flex justify-center items-center h-full invisible transition ease-in-out duration-300 bg-transparent group-hover:bg-background/50 group-hover:visible">
        <p className="text-center font-semibold drop-shadow text-3xl">{artist.nameEn}</p>
      </div>
    </Link>
  )
}