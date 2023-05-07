import { desc } from "drizzle-orm";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { albums, artists, selectAlbumSchema, selectArtistSchema } from "~/server/db/schema";

export const exploreRouter = createTRPCRouter({
  latest: publicProcedure
    .output(z.object({
      albums: z.array(selectAlbumSchema),
      artists: z.array(selectArtistSchema),
    }))
    .query(async ({ ctx: { db } }) => {
      const [latestAlbums, latestArtists] = await Promise.all([
        db.select().from(albums).orderBy(desc(albums.createdAt)).limit(5),
        db.select().from(artists).orderBy(desc(artists.createdAt)).limit(5),
      ]);

      return {
        albums: latestAlbums,
        artists: latestArtists,
      }
    }),
});
