'use client';

import Image from "next/image";
import Link from "next/link";
import { type Album } from "~/server/db/schema";

export default function AlbumCard({ album }: { album: Album }) {
  return (
    <Link href={{ pathname: `/albums/${album.id}` }} className="relative overflow-hidden w-40 h-48 group rounded-[2rem]">
      <Image alt={album.name} src={album.image} fill={true} className="absolute object-cover z-30 blur-md" />
      <div className="absolute z-40 h-full w-full object-cover transition ease-in-out duration-200 bg-background/20 group-hover:bg-background/0"></div>

      <div className="relative z-50 flex flex-col gap-2 justify-center items-center h-full p-2">
        <Image alt={album.name} src={album.image} height={100} width={100} className="rounded-xl" />
        <p className="text-center text-xl font-semibold drop-shadow">{album.name}</p>
      </div>
    </Link>
  )
}