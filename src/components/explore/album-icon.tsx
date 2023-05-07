import Image from "next/image";
import Link from "next/link";
import { cn } from "~/lib/utils";
import { type Album } from "~/server/db/schema"

type Props = {
  album: Album;
  size?: number;
}

export default function AlbumIcon({ album, size = 250 }: Props) {
  return (
    <Link href={{ pathname: `/albums/${album.id}` }} className={cn("relative overflow-hidden group rounded-2xl", `w-[${size}px] h-[${size}px]`)}>
      <Image alt={album.name} src={album.image} fill={true} className="absolute object-cover z-30" />
      <div className="relative z-40 p-2 flex justify-center items-center h-full invisible transition ease-in-out duration-300 bg-transparent group-hover:bg-background/50 group-hover:visible">
        <p className={cn("text-center font-semibold drop-shadow", size < 150 ? 'text-xl' : 'text-3xl')}>{album.name}</p>
      </div>
    </Link>
  )
}