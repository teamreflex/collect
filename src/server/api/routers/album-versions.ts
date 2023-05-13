import { eq } from "drizzle-orm"
import { adminProcedure, createTRPCRouter } from "~/server/api/trpc"
import {
  albumVersions,
  createAlbumVersionSchema,
  deleteAlbumVersionSchema,
  updateAlbumVersionSchema,
} from "~/server/db/schema"

export const albumVersionsRouter = createTRPCRouter({
  // fetchAll: adminProcedure.output(z.array(selectAlbumWithContentSchema)).query(async () => {
  //   return await fetchAlbumsWithContent()
  // }),

  // fetch: publicProcedure
  //   .input(z.number().positive().or(z.string()))
  //   .output(selectAlbumWithContentSchema.optional())
  //   .query(async ({ input }) => {
  //     return await fetchAlbumWithContent(input)
  //   }),

  create: adminProcedure
    .input(createAlbumVersionSchema)
    .mutation(async ({ input, ctx: { db } }) => {
      return await db.insert(albumVersions).values(input)
    }),

  update: adminProcedure
    .input(updateAlbumVersionSchema)
    .mutation(async ({ input, ctx: { db } }) => {
      return await db.update(albumVersions).set(input).where(eq(albumVersions.id, input.id))
    }),

  delete: adminProcedure
    .input(deleteAlbumVersionSchema)
    .mutation(async ({ input, ctx: { db } }) => {
      return await db.delete(albumVersions).where(eq(albumVersions.id, input.id))
    }),
})
