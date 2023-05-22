"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { DialogTrigger } from "@radix-ui/react-dialog"
import { ImagePlus, Loader2 } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import ImageUpload from "~/components/ui/image-upload"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip"
import { useToast } from "~/hooks/use-toast"
import { api } from "~/lib/api/client"
import { createPhotocardSetSchema, type CreatePhotocardSetSchema } from "~/server/db/schema"
import { type AlbumWithContent } from "~/server/db/types"

import { AlbumVersionSelector } from "./album-version-selector"

type Props = PropsWithChildren & {
  album: AlbumWithContent
}

export default function CreatePhotocardSet({ album, children }: Props) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<CreatePhotocardSetSchema>({
    resolver: zodResolver(createPhotocardSetSchema),
    defaultValues: {
      artistId: album.artistId,
      albumId: album.id,
      albumVersionIds: [],
    },
  })

  const router = useRouter()
  const { mutate: createPhotocardSet, isLoading } = api.photocardSets.create.useMutation({
    onSuccess(_, newData) {
      router.refresh()
      setOpen(false)
      reset()
      toast({
        description: (
          <p>
            Photocard set <span className="font-semibold">{newData.name}</span> created
          </p>
        ),
      })
    },
  })

  function onSubmit(data: CreatePhotocardSetSchema) {
    createPhotocardSet(data)
  }

  function handleImageCopy() {
    setValue("image", album.image)
    toast({
      description: "Copied image from album",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Create Photocard Set</DialogTitle>
            <DialogDescription>Create a new photocard set for {album.name}.</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 py-4">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Name</Label>
              <Input type="text" id="name" placeholder="Name..." {...register("name")} />
              {errors.name && <p className="text-xs text-red-500">{errors.name?.message}</p>}
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

            {/* Versions */}
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="albumVersionIds">Album Versions</Label>
              <Controller
                control={control}
                name="albumVersionIds"
                render={({ field: { value, onChange } }) => (
                  <AlbumVersionSelector
                    value={value}
                    onChange={onChange}
                    options={album.versions.map((v) => ({ value: v.id, label: v.name }))}
                  />
                )}
              />

              {errors.albumVersionIds && (
                <p className="text-xs text-red-500">{errors.albumVersionIds?.message}</p>
              )}
            </div>

            {/* Type */}
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="type">Photocard Type</Label>
              <Controller
                control={control}
                name="type"
                render={({ field: { onChange, value } }) => (
                  <Select value={value} onValueChange={onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a type..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="album">Album</SelectItem>
                      <SelectItem value="pob">Pre-order Benefit</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.type && <p className="text-xs text-red-500">{errors.type?.message}</p>}
            </div>
          </div>

          <DialogFooter className="flex items-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <ImagePlus
                  className="text-foreground hover:cursor-pointer"
                  onClick={handleImageCopy}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy image from album</p>
              </TooltipContent>
            </Tooltip>
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
