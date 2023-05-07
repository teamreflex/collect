import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import {
  createTRPCRouter,
  adminProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { fetchArtistWithContent } from "~/server/db/artists";
import {
  artists,
  selectArtistSchema,
  createArtistSchema,
  updateArtistSchema,
  deleteArtistSchema,
  selectArtistWithContentSchema,
} from "~/server/db/schema";

export const artistsRouter = createTRPCRouter({
  fetchAll: publicProcedure
    .output(z.array(selectArtistSchema))
    .query(async ({ ctx: { db } }) => {
      return await db.select().from(artists);
    }),

  fetch: publicProcedure
    .input(z.number().positive().or(z.string()))
    .output(selectArtistWithContentSchema.optional())
    .query(async ({ input }) => {
      return await fetchArtistWithContent(input);
    }),

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
