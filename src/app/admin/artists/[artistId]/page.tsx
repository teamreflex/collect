import { Instagram } from "lucide-react";
import { type Metadata } from "next";
import Image from "next/image";
import { cache } from "react";
import DeleteArtist from "~/components/admin/artists/delete-artist";
import UpdateArtist from "~/components/admin/artists/update-artist";
import CreateMember from "~/components/admin/members/create-member";
import DeleteMember from "~/components/admin/members/delete-member";
import UpdateMember from "~/components/admin/members/update-member";
import { H2 } from "~/components/typography"
import { fetchArtistWithMembers } from "~/server/db/artists";
import { fetchAllCompanies } from "~/server/db/companies";

type ArtistPageProps = {
  params: {
    artistId: string;
  }
}

const fetchData = cache(async (artistId: string) => {
  return await Promise.all([
    fetchArtistWithMembers(artistId),
    fetchAllCompanies()
  ]);
});

export async function generateMetadata({ params }: ArtistPageProps): Promise<Metadata> {
  const [artist] = await fetchData(params.artistId);
  const name = artist?.nameEn ?? 'Artists'
  return { title: `Admin · ${name}` }
}

export default async function Page({ params }: ArtistPageProps) {
  const [artist, companies] = await fetchData(params.artistId);

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          <div className="flex flex-col gap-2">
            <CreateMember artist={artist} />

            {artist.members.length === 0 && (
              <p className="text-center">No members</p>
            )}
            {artist.members.length > 0 && (
              <div className="flex flex-col rounded-lg border border-white divide-y divide-white divide-solid">
                {artist.members.map((member) => (
                  <div key={member.id} className="grid grid-cols-5 justify-between items-center p-3">
                    <Image className="justify-start rounded-md" alt={member.stageNameEn} src={member.image} width={50} height={50} />

                    {/* Stage Name */}
                    <div className="flex flex-col">
                      <p className="text-lg font-semibold">{member.stageNameEn}</p>
                      <p className="text-xs text-white/80">{member.stageNameKr}</p>
                    </div>

                    {/* Real Name */}
                    <div className="flex flex-col">
                      <p className="text-lg font-semibold">{member.nameEn}</p>
                      <p className="text-xs text-white/80">{member.nameKr}</p>
                    </div>

                    {/* Links */}
                    <div className="flex flex-row gap-5">
                      {member.instagram && <a href={member.instagram} target="_blank"><Instagram /></a>}
                    </div>

                    <div className="flex flex-row gap-2 justify-end">
                      <UpdateMember artist={artist} member={{ ...member, artistId: artist.id }} size="sm" />
                      <DeleteMember id={member.id} name={member.stageNameEn} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            albums
          </div>
        </div>
      </div>
    </div>
  )
}