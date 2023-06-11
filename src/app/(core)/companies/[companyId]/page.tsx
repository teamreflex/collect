import { cache } from "react"
import { type Metadata } from "next"
import { notFound } from "next/navigation"
import ArtistIcon from "~/components/explore/artist-icon"
import { H2 } from "~/components/typography"
import { siteConfig } from "~/config/site"
import { api } from "~/lib/api/server"
import { cn } from "~/lib/utils"

type CompanyPageProps = {
  params: {
    companyId: string
  }
}

const fetchData = cache(async (companyId: string) => {
  return await api.companies.fetch.fetch(companyId)
})

export async function generateMetadata({ params }: CompanyPageProps): Promise<Metadata> {
  const company = await fetchData(params.companyId)
  const name = company?.nameEn ?? "Company"
  return { title: `${name}` }
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const company = await fetchData(params.companyId)
  if (!company) notFound()

  return (
    <div className="-mt-px min-w-full">
      <div className={cn("mb-5 flex flex-col bg-gradient-to-r", siteConfig.gradient)}>
        <H2 className="text-foreground dark:text-background">
          <div className="container grid grid-cols-2 items-center lg:grid-cols-3">
            <div className="flex justify-start gap-2">{company.nameEn}</div>
          </div>
        </H2>
      </div>

      <div className="container">
        <div className="flex flex-row flex-wrap justify-center gap-3">
          {company.artists.map((artist) => (
            <ArtistIcon key={artist.id} artist={artist} />
          ))}
        </div>
      </div>
    </div>
  )
}

export const revalidate = 60
