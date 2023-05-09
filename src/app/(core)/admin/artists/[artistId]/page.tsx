import { cache } from "react"
import { type Metadata } from "next"
import Image from "next/image"
import { Headphones, Instagram } from "lucide-react"
import CreateAlbum from "~/components/admin/albums/create-album"
import DeleteAlbum from "~/components/admin/albums/delete-album"
import UpdateAlbum from "~/components/admin/albums/update-album"
import DeleteArtist from "~/components/admin/artists/delete-artist"
import UpdateArtist from "~/components/admin/artists/update-artist"
import CreateMember from "~/components/admin/members/create-member"
import DeleteMember from "~/components/admin/members/delete-member"
import UpdateMember from "~/components/admin/members/update-member"
import { H2 } from "~/components/typography"
import { api } from "~/lib/api/server"

type ArtistPageProps = {
  params: {
    artistId: string
  }
}

const fetchData = cache(async (artistId: string) => {
  return await Promise.all([api.artists.fetch.fetch(artistId), api.companies.fetchAll.fetch()])
})

export async function generateMetadata({ params }: ArtistPageProps): Promise<Metadata> {
  const [artist] = await fetchData(params.artistId)
  const name = artist?.nameEn ?? "Artists"
  return { title: `Admin · ${name}` }
}

export default async function Page({ params }: ArtistPageProps) {
  const [artist, companies] = await fetchData(params.artistId)

  if (!artist) return <H2>Invalid artist</H2>

  return (
    <div className="min-w-full">
      <div className="flex flex-col gap-3">
        <H2 className="flex flex-row justify-between">
          {artist.nameEn}
          <div className="flex flex-row gap-2">
            <UpdateArtist artist={artist} companies={companies} data-superjson />
            <DeleteArtist name={artist.nameEn} id={artist.id} />
          </div>
        </H2>

        <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
          {/* Members */}
          <div className="flex flex-col gap-2">
            <CreateMember artist={artist} />

            {artist.members.length === 0 && <p className="text-center">No members</p>}
            {artist.members.length > 0 && (
              <div className="flex flex-col divide-y divide-solid divide-foreground rounded-lg border border-foreground">
                {artist.members.map((member) => (
                  <div
                    key={member.id}
                    className="grid grid-cols-5 items-center justify-between p-3"
                  >
                    <Image
                      className="justify-start rounded-md"
                      alt={member.stageNameEn}
                      src={member.image}
                      width={50}
                      height={50}
                    />

                    {/* Stage Name */}
                    <div className="flex flex-col">
                      <p className="text-lg font-semibold">{member.stageNameEn}</p>
                      <p className="text-xs text-muted-foreground">{member.stageNameKr}</p>
                    </div>

                    {/* Real Name */}
                    <div className="flex flex-col">
                      <p className="text-lg font-semibold">{member.nameEn}</p>
                      <p className="text-xs text-muted-foreground">{member.nameKr}</p>
                    </div>

                    {/* Links */}
                    <div className="flex flex-row gap-5">
                      {member.instagram && (
                        <a href={member.instagram} target="_blank">
                          <Instagram />
                        </a>
                      )}
                    </div>

                    <div className="flex flex-row justify-end gap-2">
                      <UpdateMember
                        artist={artist}
                        member={{ ...member, artistId: artist.id }}
                        size="sm"
                      />
                      <DeleteMember id={member.id} name={member.stageNameEn} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Albums */}
          <div className="flex flex-col gap-2">
            <CreateAlbum artist={artist} />

            {artist.albums.length === 0 && <p className="text-center">No albums</p>}
            {artist.albums.length > 0 && (
              <div className="flex flex-col divide-y divide-solid divide-foreground rounded-lg border border-foreground">
                {artist.albums.map((album) => (
                  <div key={album.id} className="grid grid-cols-4 items-center justify-between p-3">
                    <Image
                      className="justify-start rounded-md"
                      alt={album.name}
                      src={album.image}
                      width={50}
                      height={50}
                    />

                    {/* Name */}
                    <div className="flex flex-col">
                      <p className="text-lg font-semibold">{album.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {album.region === "kr" && "Korean release"}
                        {album.region === "jp" && "Japanese release"}
                        {album.region === "en" && "English release"}
                        {album.region === "other" && "Other release"}
                      </p>
                    </div>

                    {/* Links */}
                    <div className="flex flex-row gap-5">
                      {album.spotifyId && (
                        <a
                          href={`https://open.spotify.com/album/${album.spotifyId}`}
                          target="_blank"
                        >
                          <Headphones />
                        </a>
                      )}
                    </div>

                    <div className="flex flex-row justify-end gap-2">
                      <UpdateAlbum artist={artist} album={album} size="sm" />
                      <DeleteAlbum id={album.id} name={album.name} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export const revalidate = 60
