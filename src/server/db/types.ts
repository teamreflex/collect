import {
  type Album,
  type AlbumVersion,
  type Artist,
  type Member,
  type Photocard,
  type PhotocardSet,
  type PhotocardSetToAlbumVersions,
  type PhotocardToMembers,
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

export type PhotocardWithContent = Prettify<
  Photocard & {
    artist: Artist
    photocardSet: PhotocardSet & {
      album: Album
    }
    members: PhotocardToMembers &
      {
        member: Member
      }[]
  }
>
