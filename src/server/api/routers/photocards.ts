import { and, eq, notInArray } from "drizzle-orm"
import { adminProcedure, createTRPCRouter, publicProcedure } from "~/server/api/trpc"
import {
  createPhotocardSchema,
  deletePhotocardSchema,
  photocards,
  photocardsToMembers,
  updatePhotocardSchema,
} from "~/server/db/schema"

export const photocardsRouter = createTRPCRouter({
  fetchAll: publicProcedure.query(async ({ ctx: { db } }) => {
    return await db.query.photocards.findMany({
      with: {
        photocardSet: {
          with: {
            album: true,
          },
        },
        artist: true,
        members: {
          with: {
            member: true,
          },
        },
      },
    })
  }),

  create: adminProcedure.input(createPhotocardSchema).mutation(async ({ input, ctx: { db } }) => {
    return await db.transaction(async (tx) => {
      const photocard = await tx.insert(photocards).values({
        name: input.name,
        photocardSetId: input.photocardSetId,
        image: input.image,
        artistId: input.artistId,
      })

      // link photocard to members
      const pivot = input.memberIds.map((memberId) => ({
        photocardId: Number(photocard.insertId),
        memberId,
      }))

      if (pivot.length) {
        await tx.insert(photocardsToMembers).values(pivot)
      }

      return photocard
    })
  }),

  update: adminProcedure.input(updatePhotocardSchema).mutation(async ({ input, ctx: { db } }) => {
    return await db.transaction(async (tx) => {
      // unlink any members that are not in the input
      await tx
        .delete(photocardsToMembers)
        .where(
          and(
            eq(photocardsToMembers.photocardId, input.id),
            notInArray(photocardsToMembers.memberId, input.memberIds ?? []),
          ),
        )

      // select the currently linked photocard
      const current = await tx
        .select()
        .from(photocardsToMembers)
        .where(eq(photocardsToMembers.photocardId, input.id))

      // link members any that are not currently linked
      const newLinks =
        input.memberIds
          ?.filter((memberId) => current.findIndex((pc) => pc.memberId === memberId) === -1)
          .map((memberId) => ({
            photocardId: input.id,
            memberId,
          })) ?? []

      if (newLinks.length) {
        await tx.insert(photocardsToMembers).values(newLinks)
      }

      // update photocard
      return await tx
        .update(photocards)
        .set({
          name: input.name,
          photocardSetId: input.photocardSetId,
          image: input.image,
          artistId: input.artistId,
        })
        .where(eq(photocards.id, input.id))
    })
  }),

  delete: adminProcedure.input(deletePhotocardSchema).mutation(async ({ input, ctx: { db } }) => {
    return await db.transaction(async (tx) => {
      // unlink members from photocard
      await tx.delete(photocardsToMembers).where(eq(photocardsToMembers.photocardId, input.id))

      // delete photocard
      return await tx.delete(photocards).where(eq(photocards.id, input.id))
    })
  }),
})
