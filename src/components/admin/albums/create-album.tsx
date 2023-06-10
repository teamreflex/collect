"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { Calendar, FileAudio, Loader2 } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { Button } from "~/components/ui/button"
import { Calendar } from "~/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import ImageUpload from "~/components/ui/image-upload"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { SpotifySearch } from "~/components/search/spotify-search"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { useToast } from "~/hooks/use-toast"
import { api } from "~/lib/api/client"
import { cn } from "~/lib/utils"
import { createAlbumSchema, type Artist, type CreateAlbumSchema } from "~/server/db/schema"

export default function CreateAlbum({ artist }: { artist: Artist }) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<CreateAlbumSchema>({
    resolver: zodResolver(createAlbumSchema),
    defaultValues: {
      artistId: artist.id,
      spotifyId: null,
    },
  })

  const router = useRouter()
  const { mutate: createAlbum, isLoading } = api.albums.create.useMutation({
    onSuccess(_, newData) {
      router.refresh()
      setOpen(false)
      reset()
      toast({
        description: (
          <p>
            Album <span className="font-semibold">{newData.name}</span> created
          </p>
        ),
      })
    },
  })

  function onSubmit(data: CreateAlbumSchema) {
    createAlbum(data)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="flex flex-row gap-1">
          <FileAudio /> Create Album
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Create Album</DialogTitle>
            <DialogDescription>Create a new album.</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 py-4 lg:grid-cols-2">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Name</Label>
              <Input type="text" id="name" placeholder="Name..." {...register("name")} />
              {errors.name && <p className="text-xs text-red-500">{errors.name?.message}</p>}
            </div>

            {/* Region */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="region">Region</Label>
              <Controller
                control={control}
                name="region"
                render={({ field: { onChange, value } }) => (
                  <Select value={value} onValueChange={onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a region..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kr">Korean Release</SelectItem>
                      <SelectItem value="jp">Japanese Release</SelectItem>
                      <SelectItem value="en">English Release</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.region && <p className="text-xs text-red-500">{errors.region?.message}</p>}
            </div>

            {/* Release Date */}
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="releaseDate">Release Date</Label>
              <Controller
                control={control}
                name="releaseDate"
                render={({ field: { onChange, value } }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "justify-start text-left font-normal",
                          !value && "text-muted-foreground",
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {value ? format(value, "yyyy-MM-dd") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={value} onSelect={onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.releaseDate && (
                <p className="text-xs text-red-500">{errors.releaseDate?.message}</p>
              )}
            </div>

            {/* Spotify */}
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="spotifyId">Spotify</Label>
              <Controller
                control={control}
                name="spotifyId"
                render={({ field: { onChange, value } }) => (
                  <SpotifySearch
                    searchType="album"
                    onSelected={onChange}
                    onImageSelected={(e) => setValue("image", e)}
                    value={value}
                  />
                )}
              />
              {errors.spotifyId && (
                <p className="text-xs text-red-500">{errors.spotifyId?.message}</p>
              )}
            </div>

            {/* Image */}
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="image">Image</Label>
              <Controller
                control={control}
                name="image"
                render={({ field: { onChange } }) => (
                  <ImageUpload folder="artists" onImageUploaded={onChange} />
                )}
              />

              {errors.image && <p className="text-xs text-red-500">{errors.image?.message}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button type="reset" variant="outline" onClick={() => reset()}>
              Reset
            </Button>
            <Button type="submit" disabled={isLoading}>
              Save
              {isLoading && <Loader2 className="ml-2 w-4 animate-spin" />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
