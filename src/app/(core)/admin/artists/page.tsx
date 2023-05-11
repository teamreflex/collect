import ArtistTable from "~/components/admin/artists/artist-table"
import { H2 } from "~/components/typography"
import { api } from "~/lib/api/server"

export const metadata = {
  title: "Admin · Artists",
}

export default async function Page() {
  const [artists, companies] = await Promise.all([
    api.artists.fetchAll.fetch(),
    api.companies.fetchAll.fetch(),
  ])

  return (
    <div className="min-w-full">
      <div className="flex flex-col gap-3">
        <H2 className="flex flex-row justify-between">Artists</H2>

        <ArtistTable data={artists} companies={companies} />
      </div>
    </div>
  )
}

export const revalidate = 60
