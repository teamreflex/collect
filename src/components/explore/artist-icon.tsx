import Image from "next/image"
import Link from "next/link"
import { cn } from "~/lib/utils"
import { type Artist } from "~/server/db/schema"

type Props = {
  artist: Artist
  size?: "sm" | "default"
}

export default function ArtistIcon({ artist, size = "default" }: Props) {
  return (
    <Link
      aria-label={artist.nameEn}
      href={{ pathname: `/artists/${artist.id}` }}
      className={cn(
        "group relative overflow-hidden shadow-md",
        size === "default" ? "h-64 w-64 rounded-[3rem]" : "h-32 w-32 rounded-2xl",
      )}
    >
      <Image
        alt={artist.nameEn}
        src={artist.image}
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
          {artist.nameEn}
        </p>
      </div>
    </Link>
  )
}
