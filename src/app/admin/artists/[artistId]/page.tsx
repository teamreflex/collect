import DeleteArtist from "~/components/admin/artists/delete-artist";
import UpdateArtist from "~/components/admin/artists/update-artist";
import CreateMember from "~/components/admin/members/create-member";
import { H2 } from "~/components/typography"
import { fetchArtistWithMembers } from "~/server/db/artists";

type ArtistPageProps = {
  params: {
    artistId: string;
  }
}

export default async function Page({ params }: ArtistPageProps) {
  const artist = await fetchArtistWithMembers(params.artistId);
  if (!artist) return <H2>Invalid artist</H2>

  return (
    <div className="min-w-full">
      <div className="flex flex-col gap-3">
        <div className="flex flex-row justify-between">
          <H2>{artist.nameEn}</H2>
          <div className="flex flex-row gap-2 justify-end">
            <UpdateArtist artist={artist} companies={[]} data-superjson />
            <DeleteArtist name={artist.nameEn} id={artist.id} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          <div className="flex flex-col gap-2">
            <CreateMember artist={artist} />
          </div>

          <div className="flex flex-col gap-2">
            albums
          </div>
        </div>
      </div>
    </div>
  )
}