import { desc, like } from "drizzle-orm";
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

  search: publicProcedure
    .input(z.string().min(2))
    .output(z.object({
      albums: z.array(selectAlbumSchema),
      artists: z.array(selectArtistSchema),
    }))
    .query(async ({ input, ctx: { db } }) => {
      const [albumResult, artistResult] = await Promise.all([
        db.select().from(albums).where(like(albums.name, `${input}%`)).limit(15),
        db.select().from(artists).where(like(artists.nameEn, `${input}%`)).limit(15),
      ]);

      return {
        albums: albumResult,
        artists: artistResult,
      }
    }),
});
