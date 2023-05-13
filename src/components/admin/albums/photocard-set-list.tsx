"use client"

import Image from "next/image"
import { Edit, PlusCircle, Trash } from "lucide-react"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { type AlbumWithContent } from "~/server/db/albums"

type Props = {
  album: AlbumWithContent
}

export default function AlbumPhotocardSetList({ album }: Props) {
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
                alt="A ver."
                src="https://i.scdn.co/image/ab67616d0000b2735fe0013ebb4022adc0f042be"
                width={100}
                height={100}
                className="rounded-lg shadow-md"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="destructive-ghost">
              <Trash />
            </Button>
            <Button>
              <Edit />
            </Button>
          </CardFooter>
        </Card>
      ))}

      {/* add new */}
      <Card className="w-[200px] transition duration-200 hover:cursor-pointer hover:bg-secondary">
        <CardHeader>
          <CardTitle>Create Set</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex w-full items-center justify-center">
            <PlusCircle className="h-48 w-48" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
