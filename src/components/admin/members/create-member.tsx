"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, UserPlus } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
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
import ImageUpload from "~/components/ui/image-upload"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { useToast } from "~/hooks/use-toast"
import { api } from "~/lib/api/client"
import { createMemberSchema, type Artist, type CreateMemberSchema } from "~/server/db/schema"

export default function CreateMember({ artist }: { artist: Artist }) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateMemberSchema>({
    resolver: zodResolver(createMemberSchema),
    defaultValues: {
      artistId: artist.id,
    },
  })

  const router = useRouter()
  const { mutate: createMember, isLoading } = api.members.create.useMutation({
    onSuccess(_, newData) {
      router.refresh()
      setOpen(false)
      reset()
      toast({
        description: (
          <p>
            Member <span className="font-semibold">{newData.stageNameEn}</span> created
          </p>
        ),
      })
    },
  })

  function onSubmit(data: CreateMemberSchema) {
    createMember(data)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="flex flex-row gap-1">
          <UserPlus /> Create Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Create Member</DialogTitle>
            <DialogDescription asChild>
              <p>
                Create a new member under <span className="text-semibold">{artist.nameEn}</span>.
              </p>
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 py-4 lg:grid-cols-2">
            <Input className="hidden" type="text" value={artist.id} {...register("artistId")} />

            {/* English name */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nameEn">Name (EN)</Label>
              <Input
                type="text"
                id="nameEn"
                placeholder="English name..."
                {...register("nameEn")}
              />
              {errors.nameEn && <p className="text-xs text-red-500">{errors.nameEn?.message}</p>}
            </div>

            {/* Korean name */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nameKr">Name (KR)</Label>
              <Input type="text" id="nameKr" placeholder="Korean name..." {...register("nameKr")} />
              {errors.nameKr && <p className="text-xs text-red-500">{errors.nameKr?.message}</p>}
            </div>

            {/* English stage name */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="stageNameEn">Stage Name (EN)</Label>
              <Input
                type="text"
                id="stageNameEn"
                placeholder="English Stage name..."
                {...register("stageNameEn")}
              />
              {errors.stageNameEn && (
                <p className="text-xs text-red-500">{errors.stageNameEn?.message}</p>
              )}
            </div>

            {/* Korean stage name */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="stageNameKr">Stage Name (KR)</Label>
              <Input
                type="text"
                id="stageNameKr"
                placeholder="Korean Stage name..."
                {...register("stageNameKr")}
              />
              {errors.stageNameKr && (
                <p className="text-xs text-red-500">{errors.stageNameKr?.message}</p>
              )}
            </div>

            {/* Instagram */}
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                type="text"
                id="instagram"
                placeholder="Instagram..."
                {...register("instagram")}
              />
              {errors.instagram && (
                <p className="text-xs text-red-500">{errors.instagram?.message}</p>
              )}
            </div>

            {/* Image */}
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="image">Image</Label>
              <Controller
                control={control}
                name="image"
                render={({ field: { onChange } }) => (
                  <ImageUpload folder="members" onImageUploaded={onChange} />
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
