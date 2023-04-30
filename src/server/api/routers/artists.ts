import { eq } from "drizzle-orm";
import { createArtistSchema } from "~/components/admin/artists/create-artist";
import { deleteArtistSchema } from "~/components/admin/artists/delete-artist";
import { updateArtistSchema } from "~/components/admin/artists/update-artist";
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

  update: adminProcedure
    .input(updateArtistSchema)
    .mutation(async ({ input, ctx: { db } }) => {
      return await db.update(artists).set(input).where(eq(artists.id, input.id));
    }),

  delete: adminProcedure
    .input(deleteArtistSchema)
    .mutation(async ({ input, ctx: { db } }) => {
      return await db.delete(artists).where(eq(artists.id, input.id));
    }),
});
