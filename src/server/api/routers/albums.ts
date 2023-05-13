import { eq } from "drizzle-orm"
import { z } from "zod"
import { adminProcedure, createTRPCRouter, publicProcedure } from "~/server/api/trpc"
import { fetchAlbumWithContent, fetchAlbumsWithContent } from "~/server/db/albums"
import {
  albums,
  createAlbumSchema,
  deleteAlbumSchema,
  selectAlbumWithContentSchema,
  updateAlbumSchema,
} from "~/server/db/schema"

export const albumsRouter = createTRPCRouter({
  fetchAll: adminProcedure.output(z.array(selectAlbumWithContentSchema)).query(async () => {
    return await fetchAlbumsWithContent()
  }),

  fetch: publicProcedure
    .input(z.number().positive().or(z.string()))
    .output(selectAlbumWithContentSchema.optional())
    .query(async ({ input }) => {
      return await fetchAlbumWithContent(input)
    }),

  create: adminProcedure.input(createAlbumSchema).mutation(async ({ input, ctx: { db } }) => {
    return await db.insert(albums).values(input)
  }),

  update: adminProcedure.input(updateAlbumSchema).mutation(async ({ input, ctx: { db } }) => {
    return await db.update(albums).set(input).where(eq(albums.id, input.id))
  }),

  delete: adminProcedure.input(deleteAlbumSchema).mutation(async ({ input, ctx: { db } }) => {
    return await db.delete(albums).where(eq(albums.id, input.id))
  }),
})
