import { atom, useAtom } from 'jotai'

export const likesAtom = atom<number[]>([])

export function useLikes() {
  const [likes, setLikes] = useAtom(likesAtom)

  function likeArtist(artistId: number) {
    setLikes([...likes, artistId])
  }

  function unlikeArtist(artistId: number) {
    setLikes(likes.filter((id) => id !== artistId))
  }

  return {
    likes,
    likeArtist,
    unlikeArtist,
  }
}