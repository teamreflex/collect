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
import { type AlbumWithContent } from "~/server/db/albums"

import CreatePhotocardSet from "./create-photocard-set"
import DeletePhotocardSet from "./delete-photocard-set"
import UpdatePhotocardSet from "./update-photocard-set"

type Props = {
  album: AlbumWithContent
}

export default function AlbumPhotocardSetList({ album }: Props) {
  console.log(album)
  return (
    <div className="flex flex-wrap gap-2">
      {album.photocardSets.map((set) => (
        <Card key={set.id} className="w-[200px] transition duration-200 hover:bg-secondary">
          <CardHeader>
            <CardTitle>{set.name}</CardTitle>
            <CardDescription>Photocards in set: 0</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex w-full items-center justify-center">
              <Image
                alt={set.name}
                src="https://i.scdn.co/image/ab67616d0000b2735fe0013ebb4022adc0f042be"
                width={100}
                height={100}
                className="rounded-lg shadow-md"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <DeletePhotocardSet photocardSet={set} />
            <UpdatePhotocardSet album={album} photocardSet={set} />
          </CardFooter>
        </Card>
      ))}

      {/* add new */}
      <Card className="w-[200px] transition duration-200 hover:cursor-pointer hover:bg-secondary">
        <CardHeader>
          <CardTitle>Create Set</CardTitle>
        </CardHeader>
        <CardContent>
          <CreatePhotocardSet album={album}>
            <div className="flex w-full items-center justify-center">
              <PlusCircle className="h-48 w-48" />
            </div>
          </CreatePhotocardSet>
        </CardContent>
      </Card>
    </div>
  )
}
