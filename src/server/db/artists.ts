import { eq } from "drizzle-orm";
import { db } from ".";
import { artistsToMembers, artists, members, type Artist, type Member } from "./schema";

export type ArtistWithMembers = Prettify<Artist & {
  members: Member[]
}>;

export async function fetchArtistsWithMembers(artistId?: number | string): Promise<ArtistWithMembers[]> {
  if (Number.isNaN(Number(artistId))) {
    return [];
  }

  let query = db
    .select({
      artist: artists,
      member: members,
      pivot: artistsToMembers,
    })
    .from(artists)
    .leftJoin(artistsToMembers, eq(artists.id, artistsToMembers.artistId))
    .leftJoin(members, eq(artistsToMembers.memberId, members.id));

  if (artistId) {
    query = query.where(eq(artists.id, Number(artistId))).limit(1);
  }

  const rows = await query;

  const result = rows.reduce<{ artist: Artist; members: Member[] }[]>(
    (acc, row) => {
      const { artist, member, pivot } = row;

      if (!acc[artist.id]) {
        acc[artist.id] = { artist, members: [] };
      }

      if (pivot && member && acc[pivot.artistId] !== undefined) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore - typescript is dumb
        acc[pivot.artistId].members.push(member);
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