'use client'

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod"
import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Checkbox } from "~/components/ui/checkbox";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import { CalendarIcon, Edit, FileAudio, Loader2 } from "lucide-react";
import { Calendar } from "~/components/ui/calendar";
import { format } from "date-fns";
import { type Artist } from "~/server/db/schema";
import { api } from "~/lib/api/client";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { useToast } from "~/hooks/use-toast";
import ImageUpload from "~/components/ui/image-upload";
import { SpotifySearch } from "~/components/ui/spotify-search";

export const updateAlbumSchema = z.object({
  id: z.number().positive(),
  artistId: z.number().positive(),
  name: z.string().min(1),
  region: z.enum(['en', 'kr', 'jp', 'other']),
  releaseDate: z.date(),
  image: z.string().min(1),
  spotifyId: z.string().min(1).optional().nullable(),
});
type UpdateAlbumSchema = z.infer<typeof updateAlbumSchema>;

type UpdateAlbumProps = {
  artist: Artist;
  album: UpdateAlbumSchema;
  size?: 'sm' | 'default';
}

export default function UpdateAlbum({ artist, album, size = 'default' }: UpdateAlbumProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const { control, register, handleSubmit, reset, formState: { errors }, setValue } = useForm<UpdateAlbumSchema>({
    resolver: zodResolver(updateAlbumSchema),
    defaultValues: {
      ...album,
    },
  });

  const router = useRouter();
  const { mutate: updateAlbum, isLoading } = api.albums.update.useMutation({
    onSuccess(_, newData) {
      router.refresh();
      setOpen(false);
      reset();
      toast({
        description: <p>Album <span className="font-semibold">{newData.name}</span> updated</p>,
      });
    },
  });

  function onSubmit(data: UpdateAlbumSchema) {
    updateAlbum(data);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size={size}>
          <Edit />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Update Album</DialogTitle>
            <DialogDescription>
              Update an existing album.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 py-4">
            <Input className="hidden" type="text" value={artist.id} {...register('artistId')} />

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Name</Label>
              <Input type="text" id="name" placeholder="Name..." {...register('name')} />
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
                )} />
              {errors.region && <p className="text-xs text-red-500">{errors.region?.message}</p>}
            </div>

            {/* Release Date */}
            <div className="flex flex-col gap-1.5 col-span-2">
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
                          !value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {value ? format(value, "yyyy-MM-dd") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={value}
                        onSelect={onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.releaseDate && <p className="text-xs text-red-500">{errors.releaseDate?.message}</p>}
            </div>

            {/* Spotify */}
            <div className="flex flex-col gap-1.5 col-span-2">
              <Label htmlFor="spotifyId">Spotify</Label>
               <Controller
                control={control}
                name="spotifyId"
                render={({ field: { onChange, value } }) => (
                  <SpotifySearch searchType="album" onSelected={onChange} onImageSelected={e => setValue('image', e)} value={value} />
                )} />
              {errors.spotifyId && <p className="text-xs text-red-500">{errors.spotifyId?.message}</p>}
            </div>

            {/* Image */}
            <div className="flex flex-col gap-1.5 col-span-2">
              <Label htmlFor="image">Image</Label>
              <Controller
                control={control}
                name="image"
                render={({ field: { onChange } }) => (
                  <ImageUpload folder="artists" onImageUploaded={onChange} />
                )} />

              {errors.image && <p className="text-xs text-red-500">{errors.image?.message}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">
              Update
              {isLoading && <Loader2 className="animate-spin ml-2 w-4" />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
