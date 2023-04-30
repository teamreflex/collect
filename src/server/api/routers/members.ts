import { createMemberSchema } from "~/components/admin/members/create-member";
import {
  createTRPCRouter,
  adminProcedure,
} from "~/server/api/trpc";
import { artistsToMembers, members } from "~/server/db/schema";

export const membersRouter = createTRPCRouter({
  create: adminProcedure
    .input(createMemberSchema)
    .mutation(async ({ input, ctx: { db } }) => {
      // create member
      const member = await db.insert(members).values({
        nameEn: input.nameEn,
        nameKr: input.nameKr,
        stageNameEn: input.stageNameEn,
        stageNameKr: input.stageNameKr,
        instagram: input.instagram,
        image: input.image,
      });

      // link member to artist
      await db.insert(artistsToMembers).values({
        artistId: input.artistId,
        memberId: Number(member.insertId),
      });

      return member;
    }),

  // update: adminProcedure
  //   .input(updateArtistSchema)
  //   .mutation(async ({ input, ctx: { db } }) => {
  //     return await db.update(artists).set(input).where(eq(artists.id, input.id));
  //   }),

  // delete: adminProcedure
  //   .input(deleteArtistSchema)
  //   .mutation(async ({ input, ctx: { db } }) => {
  //     return await db.delete(artists).where(eq(artists.id, input.id));
  //   }),
});
