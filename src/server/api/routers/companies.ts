import { createCompanySchema } from "~/components/admin/artists/create-company";
import {
  createTRPCRouter,
  adminProcedure,
} from "~/server/api/trpc";
import { companies } from "~/server/db/schema";

export const companiesRouter = createTRPCRouter({
  create: adminProcedure
    .input(createCompanySchema)
    .mutation(async ({ input, ctx: { db } }) => {
      return await db.insert(companies).values(input);
    }),
});
