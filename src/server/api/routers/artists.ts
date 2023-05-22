import { eq } from "drizzle-orm"
import { z } from "zod"
import { adminProcedure, createTRPCRouter, publicProcedure } from "~/server/api/trpc"
import {
  artists,
  createArtistSchema,
  deleteArtistSchema,
  selectArtistSchema,
  updateArtistSchema,
} from "~/server/db/schema"
import { fetchArtistWithContent } from "~/server/db/statements"

export const artistsRouter = createTRPCRouter({
  fetchAll: publicProcedure.output(z.array(selectArtistSchema)).query(async ({ ctx: { db } }) => {
    return await db.select().from(artists)
  }),

  fetch: publicProcedure.input(z.number().positive().or(z.string())).query(async ({ input }) => {
    return await fetchArtistWithContent.execute({ id: input })
  }),

  create: adminProcedure.input(createArtistSchema).mutation(async ({ input, ctx: { db } }) => {
    return await db.insert(artists).values(input)
  }),

  update: adminProcedure.input(updateArtistSchema).mutation(async ({ input, ctx: { db } }) => {
    return await db.update(artists).set(input).where(eq(artists.id, input.id))
  }),

  delete: adminProcedure.input(deleteArtistSchema).mutation(async ({ input, ctx: { db } }) => {
    return await db.delete(artists).where(eq(artists.id, input.id))
  }),
})
