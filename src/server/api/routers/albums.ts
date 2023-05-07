import { eq } from "drizzle-orm";
import {
  createTRPCRouter,
  adminProcedure,
} from "~/server/api/trpc";
import { albums, createAlbumSchema, deleteAlbumSchema, updateAlbumSchema } from "~/server/db/schema";

export const albumsRouter = createTRPCRouter({
  create: adminProcedure
    .input(createAlbumSchema)
    .mutation(async ({ input, ctx: { db } }) => {
      return await db.insert(albums).values(input);
    }),

  update: adminProcedure
    .input(updateAlbumSchema)
    .mutation(async ({ input, ctx: { db } }) => {
      return await db.update(albums).set(input).where(eq(albums.id, input.id));
    }),

  delete: adminProcedure
    .input(deleteAlbumSchema)
    .mutation(async ({ input, ctx: { db } }) => {
      return await db.delete(albums).where(eq(albums.id, input.id));
    }),
});
