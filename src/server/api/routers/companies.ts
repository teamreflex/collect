import { eq } from "drizzle-orm";
import { createCompanySchema } from "~/components/admin/companies/create-company";
import { deleteCompanySchema } from "~/components/admin/companies/delete-company";
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

  delete: adminProcedure
    .input(deleteCompanySchema)
    .mutation(async ({ input, ctx: { db } }) => {
      return await db.delete(companies).where(eq(companies.id, input.companyId));
    }),
});
