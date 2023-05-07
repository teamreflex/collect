import Image from "next/image";
import Link from "next/link";
import { type Album } from "~/server/db/schema"

type Props = {
  album: Album;
}

export default function AlbumIcon({ album }: Props) {
  return (
    <Link href={{ pathname: `/albums/${album.id}` }} className="relative overflow-hidden group rounded-2xl w-64 h-64">
      <Image alt={album.name} src={album.image} fill={true} className="absolute object-cover z-30" />
      <div className="relative z-40 p-2 flex justify-center items-center h-full invisible transition ease-in-out duration-300 bg-transparent group-hover:bg-background/50 group-hover:visible">
        <p className="text-center font-semibold drop-shadow text-3xl">{album.name}</p>
      </div>
    </Link>
  )
}