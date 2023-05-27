import { and, eq, like, notInArray } from "drizzle-orm"
import { z } from "zod"
import { adminProcedure, createTRPCRouter, publicProcedure } from "~/server/api/trpc"
import {
  createPhotocardSetSchema,
  deletePhotocardSetSchema,
  photocardSetToAlbumVersions,
  photocardSets,
  selectPhotocardSetSchema,
  updatePhotocardSetSchema,
} from "~/server/db/schema"
import { fetchPhotocardSet } from "~/server/db/statements"

export const photocardSetsRouter = createTRPCRouter({
  // fetchAll: adminProcedure.output(z.array(selectAlbumWithContentSchema)).query(async () => {
  //   return await fetchAlbumsWithContent()
  // }),

  fetch: publicProcedure.input(z.number().positive().or(z.string())).query(async ({ input }) => {
    return await fetchPhotocardSet.execute({ id: input })
  }),

  create: adminProcedure
    .input(createPhotocardSetSchema)
    .mutation(async ({ input, ctx: { db } }) => {
      return await db.transaction(async (tx) => {
        const set = await tx.insert(photocardSets).values({
          name: input.name,
          type: input.type,
          image: input.image,
          artistId: input.artistId,
          albumId: input.albumId,
        })

        // link set to album versions
        const pivot = input.albumVersionIds.map((albumVersionId) => ({
          photocardSetId: Number(set.insertId),
          albumVersionId,
        }))

        if (pivot.length) {
          await tx.insert(photocardSetToAlbumVersions).values(pivot)
        }

        return set
      })
    }),

  update: adminProcedure
    .input(updatePhotocardSetSchema)
    .mutation(async ({ input, ctx: { db } }) => {
      return await db.transaction(async (tx) => {
        // unlink any that are not in the input
        await tx
          .delete(photocardSetToAlbumVersions)
          .where(
            and(
              eq(photocardSetToAlbumVersions.photocardSetId, input.id),
              notInArray(photocardSetToAlbumVersions.albumVersionId, input.albumVersionIds ?? []),
            ),
          )

        // select the currently linked versions
        const current = await tx
          .select()
          .from(photocardSetToAlbumVersions)
          .where(eq(photocardSetToAlbumVersions.photocardSetId, input.id))

        // link any that are not currently linked
        const newLinks =
          input.albumVersionIds
            ?.filter((version) => current.findIndex((v) => v.albumVersionId === version) === -1)
            .map((version) => ({
              photocardSetId: input.id,
              albumVersionId: version,
            })) ?? []

        if (newLinks.length) {
          await tx.insert(photocardSetToAlbumVersions).values(newLinks)
        }

        // update set
        return await tx
          .update(photocardSets)
          .set({
            name: input.name,
            type: input.type,
            image: input.image,
            artistId: input.artistId,
            albumId: input.albumId,
          })
          .where(eq(photocardSets.id, input.id))
      })
    }),

  delete: adminProcedure
    .input(deletePhotocardSetSchema)
    .mutation(async ({ input, ctx: { db } }) => {
      return await db.transaction(async (tx) => {
        // unlink set from album version
        await tx
          .delete(photocardSetToAlbumVersions)
          .where(eq(photocardSetToAlbumVersions.photocardSetId, input.id))

        // delete set
        return await tx.delete(photocardSets).where(eq(photocardSets.id, input.id))
      })
    }),

  search: adminProcedure
    .input(z.string().min(1))
    .output(z.array(selectPhotocardSetSchema))
    .query(async ({ input, ctx: { db } }) => {
      return db
        .select()
        .from(photocardSets)
        .where(like(photocardSets.name, `${input}%`))
    }),
})
