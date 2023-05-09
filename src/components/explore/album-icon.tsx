import Image from "next/image"
import Link from "next/link"
import { cn } from "~/lib/utils"
import { type Album } from "~/server/db/schema"

type Props = {
  album: Album
  size?: "sm" | "default"
}

export default function AlbumIcon({ album, size = "default" }: Props) {
  return (
    <Link
      aria-label={album.name}
      href={{ pathname: `/albums/${album.id}` }}
      className={cn(
        "group relative overflow-hidden shadow-md",
        size === "default" ? "h-64 w-64 rounded-2xl" : "h-32 w-32 rounded-lg",
      )}
    >
      <Image
        alt={album.name}
        src={album.image}
        fill={true}
        className="absolute z-30 object-cover"
      />
      <div className="invisible relative z-40 flex h-full items-center justify-center bg-transparent p-2 transition duration-300 ease-in-out group-hover:visible group-hover:bg-background/50">
        <p
          className={cn(
            "text-center font-semibold drop-shadow",
            size === "default" ? "text-3xl" : "text-lg",
          )}
        >
          {album.name}
        </p>
      </div>
    </Link>
  )
}
