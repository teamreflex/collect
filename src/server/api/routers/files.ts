import { z } from "zod";
import { getUrlForUpload } from "~/lib/file-management";
import {
  createTRPCRouter,
  adminProcedure,
} from "~/server/api/trpc";

export const getSignedUrlSchema = z.object({
  filename: z.string().min(1),
});

export const filesRouter = createTRPCRouter({
  getSignedUrl: adminProcedure
    .input(getSignedUrlSchema)
    .output(z.string())
    .mutation(async ({ input }) => {
      return await getUrlForUpload(input.filename);
    }),
});
