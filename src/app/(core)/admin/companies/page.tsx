import CompanyTable from "~/components/admin/companies/company-table"
import { H2 } from "~/components/typography"
import { api } from "~/lib/api/server"

export const metadata = {
  title: "Admin · Companies",
}

export default async function AdminCompaniesPage() {
  const companies = await api.companies.fetchAll.fetch()

  return (
    <div className="min-w-full">
      <div className="flex flex-col gap-3">
        <H2 className="flex flex-row justify-between text-foreground">Companies</H2>

        <CompanyTable data={companies} />
      </div>
    </div>
  )
}

export const revalidate = 60
