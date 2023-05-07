import { Eye, Globe, Headphones, Instagram, Twitter, Youtube } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import CreateArtist from "~/components/admin/artists/create-artist"
import DeleteArtist from "~/components/admin/artists/delete-artist"
import UpdateArtist from "~/components/admin/artists/update-artist"
import { H2 } from "~/components/typography"
import { Button } from "~/components/ui/button"
import { api } from "~/lib/api/server"

export const metadata = {
  title: 'Admin · Artists',
}

export default async function Page() {
  const [artists, companies] = await Promise.all([
    api.artists.fetchAll.fetch(),
    api.companies.fetchAll.fetch(),
  ])

  return (
    <div className="min-w-full">
      <div className="flex flex-col gap-3">
        <H2 className="flex flex-row justify-between">
          Artists
          <CreateArtist companies={companies} />
        </H2>

        {artists.length === 0 && <p>No artists</p>}
        {artists.length > 0 && (
          <div className="flex flex-col rounded-lg border border-foreground divide-y divide-foreground divide-solid">
            {artists.map((artist) => (
              <div key={artist.id} className="grid grid-cols-4 justify-between items-center p-3">
                <Image className="justify-start rounded-md" alt={artist.nameEn} src={artist.image} width={50} height={50} />

                <div className="flex flex-col">
                  <p className="text-lg font-semibold text-foreground">{artist.nameEn}</p>
                  <p className="text-xs text-muted-foreground">{artist.nameKr}</p>
                </div>

                <div className="flex flex-row gap-5">
                  {artist.twitter && <a href={artist.twitter} target="_blank"><Twitter /></a>}
                  {artist.youtube && <a href={artist.youtube} target="_blank"><Youtube /></a>}
                  {artist.instagram && <a href={artist.instagram} target="_blank"><Instagram /></a>}
                  {artist.website && <a href={artist.website} target="_blank"><Globe /></a>}
                  {artist.spotifyId && <a href={`https://open.spotify.com/artist/${artist.spotifyId}`} target="_blank"><Headphones /></a>}
                </div>

                <div className="flex flex-row gap-2 justify-end">
                  <Link prefetch={false} href={{ pathname: `/admin/artists/${artist.id}` }}>
                    <Button size="sm"><Eye /></Button>
                  </Link>
                  <UpdateArtist companies={companies} artist={artist} size="sm" data-superjson />
                  <DeleteArtist id={artist.id} name={artist.nameEn} size="sm" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export const revalidate = 60;