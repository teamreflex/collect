import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { albums, artists, photocards } from "~/server/db/schema";

export const artistsRouter = createTRPCRouter({
  getCounts: publicProcedure.query(async ({ ctx: { db } }) => {
    const artistCount = await db.select().from(artists)
    const albumCount = await db.select().from(albums)
    const photocardCount = await db.select().from(photocards)

    return {
      artists: artistCount.length,
      albums: albumCount.length,
      photocards: photocardCount.length,
    };
  }),
});
