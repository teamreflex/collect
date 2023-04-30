import CreateArtist from "~/components/admin/artists/create-artist"
import DeleteArtist from "~/components/admin/artists/delete-artist"
import UpdateArtist from "~/components/admin/artists/update-artist"
import { H2 } from "~/components/typography"
import { db } from "~/server/db"
import { artists, companies } from "~/server/db/schema"

export default async function Page() {
  const allArtists = await db.select().from(artists)
  const allCompanies = await db.select().from(companies)

  return (
    <div className="min-w-full">
      <div className="flex flex-col gap-3">
        <div className="flex flex-row justify-between">
          <H2>Artists</H2>
          <CreateArtist companies={allCompanies} />
        </div>

        {allArtists.length === 0 && <p>No artists</p>}
        {allArtists.map((artist) => <div key={artist.id}>
          {artist.nameEn}
          <UpdateArtist companies={allCompanies} artist={artist} data-superjson />
          <DeleteArtist id={artist.id} name={artist.nameEn} />
        </div>)}
      </div>
    </div>
  )
}