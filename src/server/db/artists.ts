import { eq } from "drizzle-orm";
import { db } from ".";
import { artistsToMembers, artists, members, type Artist, type Member } from "./schema";
import { uniqBy } from "lodash"

export type ArtistWithMembers = Artist & {
  members: Member[]
}

export async function fetchArtistsWithMembers(): Promise<ArtistWithMembers[]> {
  const result = await db
    .select()
    .from(artistsToMembers)
    .leftJoin(members, eq(artistsToMembers.memberId, members.id))
    .leftJoin(artists, eq(artistsToMembers.artistId, artists.id));

  const dbArtists = uniqBy(result.map(row => row.artists), a => a.id);
  return dbArtists.map(a => ({
    ...a,
    members: result.map(row => row.members),
  })) as ArtistWithMembers[];
}