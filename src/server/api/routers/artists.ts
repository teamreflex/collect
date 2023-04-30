import { createArtistSchema } from "~/components/admin/artists/create-artist";
import {
  createTRPCRouter,
  adminProcedure,
} from "~/server/api/trpc";
import { artists } from "~/server/db/schema";

export const artistsRouter = createTRPCRouter({
  create: adminProcedure
    .input(createArtistSchema)
    .mutation(async ({ input, ctx: { db } }) => {
      return await db.insert(artists).values(input);
    }),
});
