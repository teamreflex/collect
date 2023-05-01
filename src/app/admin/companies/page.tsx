import Image from "next/image"
import CreateCompany from "~/components/admin/companies/create-company"
import DeleteCompany from "~/components/admin/companies/delete-company"
import UpdateCompany from "~/components/admin/companies/update-company"
import { H2 } from "~/components/typography"
import { db } from "~/server/db"
import { companies } from "~/server/db/schema"

export const metadata = {
  title: 'Admin · Companies',
}

export default async function Page() {
  const allCompanies = await db.select().from(companies)

  return (
    <div className="min-w-full">
      <div className="flex flex-col gap-3">
        <H2 className="flex flex-row justify-between">
          Companies
          <CreateCompany />
        </H2>

        {allCompanies.length === 0 && <p>No companies</p>}
        {allCompanies.length > 0 && (
          <div className="flex flex-col rounded-lg border border-white divide-y divide-white divide-solid">
            {allCompanies.map((company) => (
              <div key={company.id} className="grid grid-cols-3 items-center p-3">
                <Image className="rounded-md" alt={company.nameEn} src={company.image} width={50} height={50} />
                <div className="flex flex-col">
                  <p className="text-lg font-semibold">{company.nameEn}</p>
                  <p className="text-xs text-white/80">{company.nameKr}</p>
                </div>
                <div className="flex flex-row gap-2 justify-end">
                  <UpdateCompany {...company} />
                  <DeleteCompany id={company.id} name={company.nameEn} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export const runtime = "edge";