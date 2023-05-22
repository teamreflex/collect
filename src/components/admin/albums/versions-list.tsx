"use client"

import Image from "next/image"
import { PlusCircle } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { type AlbumWithContent } from "~/server/db/types"

import CreateAlbumVersion from "./create-version"
import DeleteAlbumVersion from "./delete-version"
import UpdateAlbumVersion from "./update-version"

type Props = {
  album: AlbumWithContent
}

export default function AlbumVersionsList({ album }: Props) {
  return (
    <>
      <div className="flex flex-wrap gap-2">
        {album.versions.map((version) => (
          <Card key={version.id} className="w-[200px] transition duration-200 hover:bg-secondary">
            <CardHeader>
              <CardTitle>{version.name}</CardTitle>
              <CardDescription>Photocard sets: {version.photocardSets.length}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex w-full items-center justify-center">
                <Image
                  alt={version.name}
                  src="https://i.scdn.co/image/ab67616d0000b2735fe0013ebb4022adc0f042be"
                  width={100}
                  height={100}
                  className="rounded-lg shadow-md"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <DeleteAlbumVersion version={version} />
              <UpdateAlbumVersion version={version} />
            </CardFooter>
          </Card>
        ))}

        {/* add new */}
        <Card className="w-[200px] transition duration-200 hover:cursor-pointer hover:bg-secondary">
          <CardHeader>
            <CardTitle>Create Version</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateAlbumVersion album={album}>
              <div className="flex w-full items-center justify-center">
                <PlusCircle className="h-48 w-48" />
              </div>
            </CreateAlbumVersion>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
