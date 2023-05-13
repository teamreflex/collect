import { version } from "os"
import { eq } from "drizzle-orm"

import { db } from "."
import {
  albumVersions,
  albums,
  artists,
  photocardSets,
  type Album,
  type AlbumVersion,
  type Artist,
  type PhotocardSet,
} from "./schema"

export type AlbumVersionWithPhotocardSets = Prettify<
  AlbumVersion & {
    photocardSets: PhotocardSet[]
  }
>

export type AlbumWithContent = Prettify<
  Album & {
    artist: Artist
    versions: AlbumVersionWithPhotocardSets[]
    photocardSets: PhotocardSet[]
  }
>

export async function fetchAlbumsWithContent(
  albumId?: number | string,
): Promise<AlbumWithContent[]> {
  if (albumId !== undefined && Number.isNaN(Number(albumId))) {
    return []
  }

  let query = db
    .select({
      album: albums,
      artist: artists,
      albumVersion: albumVersions,
      photocardSet: photocardSets,
    })
    .from(albums)
    .innerJoin(artists, eq(albums.artistId, artists.id))
    .leftJoin(albumVersions, eq(albums.id, albumVersions.albumId))
    .leftJoin(photocardSets, eq(albumVersions.id, photocardSets.albumVersionId))

  if (albumId) {
    query = query.where(eq(artists.id, Number(albumId)))
  }

  const rows = await query

  const result = rows.reduce<
    {
      album: Album
      artist: Artist
      albumVersions: AlbumVersionWithPhotocardSets[]
      photocardSets: PhotocardSet[]
    }[]
  >((acc, row) => {
    const { album, artist, albumVersion, photocardSet } = row

    // initialize row
    if (acc[album.id] === undefined) {
      acc[album.id] = { album, artist, albumVersions: [], photocardSets: [] }
    }

    const albumVersionExists =
      acc[artist.id]?.albumVersions &&
      acc[artist.id]?.albumVersions.findIndex((a) => a.id === albumVersion?.id) !== -1
    if (albumVersion && !albumVersionExists) {
      acc[artist.id]?.albumVersions.push({
        ...albumVersion,
        photocardSets: [],
      })
    }

    const photocardSetExists =
      acc[artist.id]?.photocardSets &&
      acc[artist.id]?.photocardSets.findIndex((a) => a.id === photocardSet?.id) !== -1
    if (photocardSet && !photocardSetExists) {
      acc[artist.id]?.photocardSets.push(photocardSet)
    }

    return acc
  }, [])

  return Object.values(result).map((r) => ({
    ...r.album,
    artist: r.artist,
    versions: r.albumVersions.map((ver) => ({
      ...ver,
      photocardSets: r.photocardSets.filter((set) => set.albumVersionId === ver.id),
    })),
    photocardSets: r.photocardSets,
  }))
}

export async function fetchAlbumWithContent(
  albumId: number | string,
): Promise<AlbumWithContent | undefined> {
  const result = await fetchAlbumsWithContent(albumId)
  return result[0]
}
