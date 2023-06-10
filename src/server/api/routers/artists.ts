import { TRPCError } from "@trpc/server"
import { and, eq, like } from "drizzle-orm"
import { z } from "zod"
import { adminProcedure, createTRPCRouter, publicProcedure } from "~/server/api/trpc"
import {
  artists,
  createArtistSchema,
  createLikeSchema,
  deleteArtistSchema,
  likes,
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

  like: publicProcedure.input(createLikeSchema).mutation(async ({ input, ctx: { db, auth } }) => {
    if (!auth?.userId) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "You must be logged in to like an artist" })
    }

    return await db.insert(likes).values({
      clerkId: auth.userId,
      artistId: input.artistId,
    })
  }),

  unlike: publicProcedure.input(createLikeSchema).mutation(async ({ input, ctx: { db, auth } }) => {
    if (!auth?.userId) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "You must be logged in to unlike an artist" })
    }

    return await db.delete(likes).where(and(
      eq(likes.clerkId, auth.userId),
      eq(likes.artistId, input.artistId)
    ))
  }),

  search: adminProcedure
    .input(z.string().min(1))
    .output(z.array(selectArtistSchema))
    .query(async ({ input, ctx: { db } }) => {
      return db
        .select()
        .from(artists)
        .where(like(artists.nameEn, `${input}%`))
    }),
})
