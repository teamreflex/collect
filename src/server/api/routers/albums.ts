import { eq } from "drizzle-orm"
import { z } from "zod"
import { adminProcedure, createTRPCRouter, publicProcedure } from "~/server/api/trpc"
import { albums, createAlbumSchema, deleteAlbumSchema, updateAlbumSchema } from "~/server/db/schema"
import { fetchAlbumWithContent } from "~/server/db/statements"

export const albumsRouter = createTRPCRouter({
  fetchAll: adminProcedure.query(async ({ ctx: { db } }) => {
    return await db.query.albums.findMany({
      with: {
        artist: true,
      },
    })
  }),

  fetch: publicProcedure.input(z.number().positive().or(z.string())).query(async ({ input }) => {
    return await fetchAlbumWithContent.execute({ id: input })
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
