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
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip"
import { useToast } from "~/hooks/use-toast"
import { api } from "~/lib/api/client"
import {
  createAlbumVersionSchema,
  type Album,
  type CreateAlbumVersionSchema,
} from "~/server/db/schema"

type Props = PropsWithChildren & {
  album: Album
}

export default function CreateAlbumVersion({ album, children }: Props) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<CreateAlbumVersionSchema>({
    resolver: zodResolver(createAlbumVersionSchema),
    defaultValues: {
      albumId: album.id,
    },
  })

  const router = useRouter()
  const { mutate: createVersion, isLoading } = api.albumVersions.create.useMutation({
    onSuccess(_, newData) {
      router.refresh()
      setOpen(false)
      reset()
      toast({
        description: (
          <p>
            Album version <span className="font-semibold">{newData.name}</span> created
          </p>
        ),
      })
    },
  })

  function onSubmit(data: CreateAlbumVersionSchema) {
    createVersion(data)
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
            <DialogTitle>Create Album Version</DialogTitle>
            <DialogDescription>Create a new version of {album.name}.</DialogDescription>
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
            <Button type="submit">
              Save
              {isLoading && <Loader2 className="ml-2 w-4 animate-spin" />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
