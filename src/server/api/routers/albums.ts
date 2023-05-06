import { eq } from "drizzle-orm";
import { createAlbumSchema } from "~/components/admin/albums/create-album";
import { deleteAlbumSchema } from "~/components/admin/albums/delete-album";
import { updateAlbumSchema } from "~/components/admin/albums/update-album";
import {
  createTRPCRouter,
  adminProcedure,
} from "~/server/api/trpc";
import { albums } from "~/server/db/schema";

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
