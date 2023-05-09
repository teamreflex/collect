import { eq } from "drizzle-orm"
import { z } from "zod"
import { adminProcedure, createTRPCRouter, publicProcedure } from "~/server/api/trpc"
import {
  companies,
  createCompanySchema,
  deleteCompanySchema,
  selectCompanySchema,
  updateCompanySchema,
} from "~/server/db/schema"

export const companiesRouter = createTRPCRouter({
  fetchAll: publicProcedure.output(z.array(selectCompanySchema)).query(async ({ ctx: { db } }) => {
    return await db.select().from(companies)
  }),

  create: adminProcedure.input(createCompanySchema).mutation(async ({ input, ctx: { db } }) => {
    return await db.insert(companies).values(input)
  }),

  update: adminProcedure.input(updateCompanySchema).mutation(async ({ input, ctx: { db } }) => {
    return await db.update(companies).set(input).where(eq(companies.id, input.id))
  }),

  delete: adminProcedure.input(deleteCompanySchema).mutation(async ({ input, ctx: { db } }) => {
    return await db.delete(companies).where(eq(companies.id, input.id))
  }),
})
