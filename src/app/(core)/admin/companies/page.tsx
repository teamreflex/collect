import Image from "next/image"
import CreateCompany from "~/components/admin/companies/create-company"
import DeleteCompany from "~/components/admin/companies/delete-company"
import UpdateCompany from "~/components/admin/companies/update-company"
import { H2 } from "~/components/typography"
import { api } from "~/lib/api/server"

export const metadata = {
  title: "Admin · Companies",
}

export default async function Page() {
  const companies = await api.companies.fetchAll.fetch()

  return (
    <div className="min-w-full">
      <div className="flex flex-col gap-3">
        <H2 className="flex flex-row justify-between text-foreground">
          Companies
          <CreateCompany />
        </H2>

        {companies.length === 0 && <p>No companies</p>}
        {companies.length > 0 && (
          <div className="flex flex-col divide-y divide-solid divide-foreground rounded-lg border border-foreground">
            {companies.map((company) => (
              <div key={company.id} className="grid grid-cols-3 items-center p-3">
                <Image
                  className="rounded-md"
                  alt={company.nameEn}
                  src={company.image}
                  width={50}
                  height={50}
                />
                <div className="flex flex-col">
                  <p className="text-lg font-semibold text-foreground">{company.nameEn}</p>
                  <p className="text-xs text-muted-foreground">{company.nameKr}</p>
                </div>
                <div className="flex flex-row justify-end gap-2">
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

export const revalidate = 60
