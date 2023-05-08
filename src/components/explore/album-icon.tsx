import Image from "next/image";
import Link from "next/link";
import { cn } from "~/lib/utils";
import { type Album } from "~/server/db/schema"

type Props = {
  album: Album;
  size?: 'sm' | 'default';
}

export default function AlbumIcon({ album, size = 'default' }: Props) {
  return (
    <Link href={{ pathname: `/albums/${album.id}` }} className={cn("relative overflow-hidden group", size === 'default' ? 'rounded-2xl w-64 h-64' : 'rounded-lg w-32 h-32')}>
      <Image alt={album.name} src={album.image} fill={true} className="absolute object-cover z-30" />
      <div className="relative z-40 p-2 flex justify-center items-center h-full invisible transition ease-in-out duration-300 bg-transparent group-hover:bg-background/50 group-hover:visible">
        <p className={cn("text-center font-semibold drop-shadow", size === 'default' ? 'text-3xl' : 'text-lg')}>{album.name}</p>
      </div>
    </Link>
  )
}