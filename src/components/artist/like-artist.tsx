"use client"

import { useState } from "react"
import { Heart, HeartOff } from "lucide-react"
import { useToast } from "~/hooks/use-toast"
import { type Artist } from "~/server/db/schema"

export default function LikeArtist({ artist }: { artist: Artist }) {
  const { toast } = useToast()
  const [liked, setLiked] = useState(false)
  const [hovering, setHovering] = useState(false)

  function onClick() {
    // TODO: update database
    setLiked(!liked)
    toast({
      description: `${artist.nameEn} ${liked ? "unliked" : "liked"}!`,
    })
  }

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {liked && !hovering && <Heart className="fill-red-500 text-red-500" />}
      {liked && hovering && <HeartOff className="fill-red-500 text-red-500" />}
      {!liked && !hovering && <Heart />}
      {!liked && hovering && <Heart className="fill-red-500 text-red-500" />}
    </button>
  )
}
