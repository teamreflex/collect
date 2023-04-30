import { Globe, Instagram, Twitter, Youtube } from "lucide-react"
import Image from "next/image"
import CreateArtist from "~/components/admin/artists/create-artist"
import DeleteArtist from "~/components/admin/artists/delete-artist"
import UpdateArtist from "~/components/admin/artists/update-artist"
import CreateMember from "~/components/admin/members/create-member"
import { H2 } from "~/components/typography"
import { db } from "~/server/db"
import { artists, companies } from "~/server/db/schema"

export default async function Page() {
  const allArtists = await db.select().from(artists);
  const allCompanies = await db.select().from(companies);

  return (
    <div className="min-w-full">
      <div className="flex flex-col gap-3">
        <div className="flex flex-row justify-between">
          <H2>Artists</H2>
          <CreateArtist companies={allCompanies} />
        </div>

        {allArtists.length === 0 && <p>No artists</p>}

        <div className="flex flex-col rounded-lg border border-white divide-y divide-white divide-solid">
          {allArtists.map((artist) => (
            <div key={artist.id} className="grid grid-cols-4 justify-between items-center p-3">
              <Image className="justify-start rounded-md" alt={artist.nameEn} src={artist.image} width={50} height={50} />

              <div className="flex flex-col">
                <p className="text-lg font-semibold">{artist.nameEn}</p>
                <p className="text-xs text-white/80">{artist.nameKr}</p>
              </div>

              <div className="flex flex-row gap-5">
                {artist.twitter && <a href={artist.twitter} target="_blank"><Twitter /></a>}
                {artist.youtube && <a href={artist.youtube} target="_blank"><Youtube /></a>}
                {artist.instagram && <a href={artist.instagram} target="_blank"><Instagram /></a>}
                {artist.website && <a href={artist.website} target="_blank"><Globe /></a>}
              </div>

              <div className="flex flex-row gap-2 justify-end">
                <CreateMember artist={artist} />
                <UpdateArtist companies={allCompanies} artist={artist} data-superjson />
                <DeleteArtist id={artist.id} name={artist.nameEn} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}