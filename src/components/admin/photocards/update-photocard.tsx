import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { ArtistSearch } from "~/components/search/artist-search"
import { PhotocardSetSearch } from "~/components/search/photocard-set-search"
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
import { useToast } from "~/hooks/use-toast"
import { api } from "~/lib/api/client"
import { updatePhotocardSchema, type UpdatePhotocardSchema } from "~/server/db/schema"
import { type PhotocardWithContent } from "~/server/db/types"

type UpdatePhotocardProps = {
  photocard: PhotocardWithContent
  open: boolean
  setOpen: (open: boolean) => void
}

export default function UpdatePhotocard({ photocard, open, setOpen }: UpdatePhotocardProps) {
  const { toast } = useToast()

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdatePhotocardSchema>({
    resolver: zodResolver(updatePhotocardSchema),
    defaultValues: {
      ...photocard,
      memberIds: photocard.members.map((pivot) => pivot.member.id),
    },
  })

  const router = useRouter()
  const { mutate: updatePhotocard, isLoading } = api.photocards.update.useMutation({
    onSuccess(_, newData) {
      router.refresh()
      setOpen(false)
      reset(newData)
      toast({
        description: (
          <p>
            Photocard <span className="font-semibold">{newData.name}</span> updated
          </p>
        ),
      })
    },
  })

  function onSubmit(data: UpdatePhotocardSchema) {
    updatePhotocard(data)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Update Photocard</DialogTitle>
            <DialogDescription>Update an existing photocard.</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 py-4 lg:grid-cols-2">
            {/* Name */}
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="name">Name</Label>
              <Input type="text" id="name" placeholder="Name..." {...register("name")} />
              {errors.name && <p className="text-xs text-red-500">{errors.name?.message}</p>}
            </div>

            {/* Artist */}
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="artistId">Artist</Label>
              <Controller
                control={control}
                name="artistId"
                render={({ field: { onChange, value } }) => (
                  <ArtistSearch onSelected={onChange} value={value} />
                )}
              />
              {errors.artistId && (
                <p className="text-xs text-red-500">{errors.artistId?.message}</p>
              )}
            </div>

            {/* PhotocardSet */}
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="photocardSetId">Photocard Set</Label>
              <Controller
                control={control}
                name="photocardSetId"
                render={({ field: { onChange, value } }) => (
                  <PhotocardSetSearch onSelected={onChange} value={value} />
                )}
              />
              {errors.photocardSetId && (
                <p className="text-xs text-red-500">{errors.photocardSetId?.message}</p>
              )}
            </div>

            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="image">Image</Label>
              <Controller
                control={control}
                name="image"
                render={({ field: { onChange } }) => (
                  <ImageUpload folder="companies" onImageUploaded={onChange} />
                )}
              />

              {errors.image && <p className="text-xs text-red-500">{errors.image?.message}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              Update
              {isLoading && <Loader2 className="ml-2 w-4 animate-spin" />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
