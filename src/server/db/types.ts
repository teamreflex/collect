import {
  type Album,
  type AlbumVersion,
  type Artist,
  type PhotocardSet,
  type PhotocardSetToAlbumVersions,
} from "./schema"

export type AlbumVersionWithPhotocardSets = Prettify<
  AlbumVersion & {
    photocardSets: PhotocardSetToAlbumVersions[]
  }
>

export type PhotocardSetWithVersion = PhotocardSet & {
  versions: PhotocardSetToAlbumVersions[]
}

export type AlbumWithArtist = Prettify<
  Album & {
    artist: Artist
  }
>

export type AlbumWithContent = Prettify<
  Album & {
    artist: Artist
    versions: AlbumVersionWithPhotocardSets[]
    photocardSets: PhotocardSetWithVersion[]
  }
>
