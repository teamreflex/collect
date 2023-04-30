import CreateArtist from "~/components/admin/artists/create-artist"
import { H2 } from "~/components/typography"
import { db } from "~/server/db"
import { artists } from "~/server/db/schema"

export default async function Page() {
  const allArtists = await db.select().from(artists)

  return (
    <div className="min-w-full">
      <div className="flex flex-col gap-3">
        <div className="flex flex-row justify-between">
          <H2>Artists</H2>
          <CreateArtist />
        </div>

        {allArtists.length === 0 && <p>No artists</p>}
        {allArtists.map((artist) => <p key={artist.id}>{artist.nameEn}</p>)}
      </div>
    </div>
  )
}