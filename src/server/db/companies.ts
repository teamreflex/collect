import { eq } from "drizzle-orm";
import { db } from ".";
import { type Company, companies } from "./schema";

export async function fetchAllCompanies(): Promise<Company[]> {
  return await db.select().from(companies);
}

export async function fetchCompany(companyId: number | string): Promise<Company | undefined> {
  if (Number.isNaN(Number(companyId))) {
    return undefined;
  }

  const result = await db.select().from(companies).where(eq(companies.id, Number(companyId))).limit(1);
  return result[0];
}