import CreateCompany from "~/components/admin/companies/create-company"
import DeleteCompany from "~/components/admin/companies/delete-company"
import UpdateCompany from "~/components/admin/companies/update-company"
import { H2 } from "~/components/typography"
import { db } from "~/server/db"
import { companies } from "~/server/db/schema"

export default async function Page() {
  const allCompanies = await db.select().from(companies)

  return (
    <div className="min-w-full">
      <div className="flex flex-col gap-3">
        <div className="flex flex-row justify-between">
          <H2>Companies</H2>
          <CreateCompany />
        </div>

        {allCompanies.length === 0 && <p>No companies</p>}
        {allCompanies.map((c) => <div key={c.id}>
          {c.nameEn}
          <UpdateCompany {...c} />
          <DeleteCompany name={c.nameEn} id={c.id} />
        </div>)}
      </div>
    </div>
  )
}