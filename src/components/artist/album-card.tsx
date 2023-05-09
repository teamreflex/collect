"use client"

import Image from "next/image"
import Link from "next/link"
import { type Album } from "~/server/db/schema"

export default function AlbumCard({ album }: { album: Album }) {
  return (
    <Link
      href={{ pathname: `/albums/${album.id}` }}
      className="group relative h-48 w-40 overflow-hidden rounded-[2rem]"
    >
      <Image
        alt={album.name}
        src={album.image}
        fill={true}
        className="absolute z-30 object-cover blur-md"
      />
      <div className="absolute z-40 h-full w-full bg-background/20 object-cover transition duration-200 ease-in-out group-hover:bg-background/0"></div>

      <div className="relative z-50 flex h-full flex-col items-center justify-center gap-2 p-2">
        <Image alt={album.name} src={album.image} height={100} width={100} className="rounded-xl" />
        <p className="text-center text-xl font-semibold drop-shadow">{album.name}</p>
      </div>
    </Link>
  )
}
