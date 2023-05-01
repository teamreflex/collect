import { eq } from "drizzle-orm";
import { db } from ".";
import { artistsToMembers, artists, members, type Artist, type Member, type Album, albums, companies, type Company } from "./schema";

export type ArtistWithMembers = Prettify<Artist & {
  members: Member[];
}>;

export type ArtistWithMembersAndAlbums = Prettify<Artist & {
  members: Member[];
  albums: Album[];
}>;

export async function fetchArtistsWithMembers(artistId?: number | string): Promise<ArtistWithMembers[]> {
  if (Number.isNaN(Number(artistId))) {
    return [];
  }

  let query = db
    .select({ artist: artists, member: members, pivot: artistsToMembers })
    .from(artists)
    .leftJoin(artistsToMembers, eq(artists.id, artistsToMembers.artistId))
    .leftJoin(members, eq(artistsToMembers.memberId, members.id));

  if (artistId) {
    query = query.where(eq(artists.id, Number(artistId)));
  }

  const rows = await query;
  const result = rows.reduce<{ artist: Artist; members: Member[] }[]>(
    (acc, row) => {
      const { artist, member } = row;

      // initialize row
      if (!acc[artist.id]) {
        acc[artist.id] = { artist, members: [] };
      }

      if (member) {
        acc[artist.id]?.members.push(member);
      }

      return acc;
    },
    [],
  );

  return Object.values(result).map(r => ({
    ...r.artist,
    members: r.members,
  }));
}

export async function fetchArtistWithMembers(artistId: number | string): Promise<ArtistWithMembers | undefined> {
  const result = await fetchArtistsWithMembers(artistId);
  return result[0];
}

export async function fetchArtistsWithContent(artistId?: number | string): Promise<ArtistWithMembersAndAlbums[]> {
  if (Number.isNaN(Number(artistId))) {
    return [];
  }

  let query = db
    .select({ artist: artists, member: members, pivot: artistsToMembers, company: companies, album: albums })
    .from(artists)
    .innerJoin(companies, eq(artists.companyId, companies.id))
    .leftJoin(artistsToMembers, eq(artists.id, artistsToMembers.artistId))
    .leftJoin(members, eq(artistsToMembers.memberId, members.id))
    .leftJoin(albums, eq(albums.artistId, artists.id));

  if (artistId) {
    query = query.where(eq(artists.id, Number(artistId)));
  }

  const rows = await query;

  const result = rows.reduce<{ artist: Artist; members: Member[], company: Company, albums: Album[] }[]>(
    (acc, row) => {
      const { artist, member, company, album } = row;

      // initialize row
      if (acc[artist.id] === undefined) {
        acc[artist.id] = { artist, members: [], company, albums: [] };
      }

      if (member) {
        acc[artist.id]?.members.push(member);
      }

      if (album) {
        acc[artist.id]?.albums.push(album);
      }

      return acc;
    },
    [],
  );

  return Object.values(result).map(r => ({
    ...r.artist,
    members: r.members,
    company: r.company,
    albums: r.albums,
  }));
}

export async function fetchArtistWithContent(artistId: number | string): Promise<ArtistWithMembersAndAlbums | undefined> {
  const result = await fetchArtistsWithContent(artistId);
  return result[0];
}