"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import { useToast } from "~/hooks/use-toast"
import { type Artist } from "~/server/db/schema"
import { api } from "~/lib/api/client"
import { useLikes } from "~/hooks/use-likes"
import { cn } from "~/lib/utils"

export default function LikeArtist({ artist }: { artist: Artist }) {
  const { likes, likeArtist, unlikeArtist } = useLikes()

  const { toast } = useToast()
  const [liked, setLiked] = useState(likes.includes(artist.id))

  const { mutate: like, isLoading: isLikeLoading } = api.artists.like.useMutation({
    onSuccess() {
      setLiked(true)
      likeArtist(artist.id)
      toast({
        description: `${artist.nameEn} liked!`,
      })
    },
  })

  const { mutate: unlike, isLoading: isUnlikeLoading } = api.artists.unlike.useMutation({
    onSuccess() {
      setLiked(false)
      unlikeArtist(artist.id)
      toast({
        description: `${artist.nameEn} unliked!`,
      })
    },
  })

  function onClick() {
    const payload = { artistId: artist.id }
    liked ? unlike(payload) : like(payload)
  }

  return (
    <button
      onClick={onClick}
      disabled={isLikeLoading || isUnlikeLoading}
    >
      <Heart className={cn("hover:scale-110 transition", liked && "fill-red-500 text-red-500" )} />
    </button>
  )
}
