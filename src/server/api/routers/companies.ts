import { eq } from "drizzle-orm"
import { z } from "zod"
import { adminProcedure, createTRPCRouter, publicProcedure } from "~/server/api/trpc"
import {
  companies,
  createCompanySchema,
  deleteCompanySchema,
  updateCompanySchema,
} from "~/server/db/schema"
import { fetchCompanyWithArtists } from "~/server/db/statements"

export const companiesRouter = createTRPCRouter({
  fetchAll: publicProcedure.query(async ({ ctx: { db } }) => {
    return await db.query.companies.findMany({
      with: {
        artists: true,
      },
    })
  }),

  fetch: publicProcedure.input(z.number().positive().or(z.string())).query(async ({ input }) => {
    return await fetchCompanyWithArtists.execute({ id: input })
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
