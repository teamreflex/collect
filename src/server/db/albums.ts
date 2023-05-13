import { eq } from "drizzle-orm"

import { db } from "."
import {
  albumVersions,
  albums,
  artists,
  artistsToMembers,
  companies,
  members,
  type Album,
  type AlbumVersion,
  type Artist,
} from "./schema"

export type AlbumWithContent = Prettify<
  Album & {
    artist: Artist
    versions: AlbumVersion[]
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
    })
    .from(albums)
    .innerJoin(artists, eq(albums.artistId, artists.id))
    .leftJoin(albumVersions, eq(albums.id, albumVersions.albumId))

  if (albumId) {
    query = query.where(eq(artists.id, Number(albumId)))
  }

  const rows = await query

  const result = rows.reduce<{ album: Album; artist: Artist; albumVersions: AlbumVersion[] }[]>(
    (acc, row) => {
      const { album, artist, albumVersion } = row

      // initialize row
      if (acc[album.id] === undefined) {
        acc[album.id] = { album, artist, albumVersions: [] }
      }

      const albumVersionExists =
        acc[artist.id]?.albumVersions &&
        acc[artist.id]?.albumVersions.findIndex((a) => a.id === albumVersion?.id) !== -1
      if (albumVersion && !albumVersionExists) {
        acc[artist.id]?.albumVersions.push(albumVersion)
      }

      return acc
    },
    [],
  )

  return Object.values(result).map((r) => ({
    ...r.album,
    artist: r.artist,
    versions: r.albumVersions,
  }))
}

export async function fetchAlbumWithContent(
  albumId: number | string,
): Promise<AlbumWithContent | undefined> {
  const result = await fetchAlbumsWithContent(albumId)
  return result[0]
}
