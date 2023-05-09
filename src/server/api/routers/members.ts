import { eq } from "drizzle-orm"
import { adminProcedure, createTRPCRouter } from "~/server/api/trpc"
import {
  artistsToMembers,
  createMemberSchema,
  deleteMemberSchema,
  members,
  updateMemberSchema,
} from "~/server/db/schema"

export const membersRouter = createTRPCRouter({
  create: adminProcedure.input(createMemberSchema).mutation(async ({ input, ctx: { db } }) => {
    // create member
    const member = await db.insert(members).values({
      nameEn: input.nameEn,
      nameKr: input.nameKr,
      stageNameEn: input.stageNameEn,
      stageNameKr: input.stageNameKr,
      instagram: input.instagram,
      image: input.image,
    })

    // link member to artist
    await db.insert(artistsToMembers).values({
      artistId: input.artistId,
      memberId: Number(member.insertId),
    })

    return member
  }),

  update: adminProcedure.input(updateMemberSchema).mutation(async ({ input, ctx: { db } }) => {
    return await db
      .update(members)
      .set({
        nameEn: input.nameEn,
        nameKr: input.nameKr,
        stageNameEn: input.stageNameEn,
        stageNameKr: input.stageNameKr,
        instagram: input.instagram,
        image: input.image,
      })
      .where(eq(members.id, input.id))
  }),

  delete: adminProcedure.input(deleteMemberSchema).mutation(async ({ input, ctx: { db } }) => {
    await db.delete(artistsToMembers).where(eq(artistsToMembers.memberId, input.id))
    return await db.delete(members).where(eq(members.id, input.id))
  }),
})
