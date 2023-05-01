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
import { useState } from "react";
import { Edit, Loader2 } from "lucide-react";
import { type Artist } from "~/server/db/schema";
import { api } from "~/lib/api/client";
import { useRouter } from "next/navigation";
import { useToast } from "~/hooks/use-toast";
import ImageUpload from "~/components/ui/image-upload";

export const updateMemberSchema = z.object({
  id: z.number().positive(),
  artistId: z.number().positive(),
  nameEn: z.string().min(1),
  nameKr: z.string().min(1),
  stageNameEn: z.string().min(1),
  stageNameKr: z.string().min(1),
  image: z.string().min(1),
  instagram: z.string().min(1),
});
export type UpdateMemberSchema = z.infer<typeof updateMemberSchema>;

type UpdateMemberProps = {
  artist: Artist;
  member: UpdateMemberSchema;
  size?: 'sm' | 'default';
}

export default function UpdateMember({ artist, member, size = 'default' }: UpdateMemberProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const { control, register, handleSubmit, reset, formState: { errors } } = useForm<UpdateMemberSchema>({
    resolver: zodResolver(updateMemberSchema),
    defaultValues: {
      ...member,
    },
  });

  const router = useRouter();
  const { mutate: updateMember, isLoading } = api.members.update.useMutation({
    onSuccess(_, newData) {
      setOpen(false);
      reset(newData);
      toast({
        description: <p>Member <span className="font-semibold">{newData.stageNameEn}</span> updated</p>
      })
      router.refresh();
    },
  });

  function onSubmit(data: UpdateMemberSchema) {
    updateMember(data);
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
            <DialogTitle>Update Member</DialogTitle>
            <DialogDescription asChild>
              <p>Update an existing member.</p>
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 py-4">
            <Input className="hidden" type="text" value={artist.id} {...register('artistId')} />

            {/* English name */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nameEn">Name (EN)</Label>
              <Input type="text" id="nameEn" placeholder="English name..." {...register('nameEn')} />
              {errors.nameEn && <p className="text-xs text-red-500">{errors.nameEn?.message}</p>}
            </div>

            {/* Korean name */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nameKr">Name (KR)</Label>
              <Input type="text" id="nameKr" placeholder="Korean name..." {...register('nameKr')} />
              {errors.nameKr && <p className="text-xs text-red-500">{errors.nameKr?.message}</p>}
            </div>

            {/* English stage name */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="stageNameEn">Stage Name (EN)</Label>
              <Input type="text" id="stageNameEn" placeholder="English Stage name..." {...register('stageNameEn')} />
              {errors.stageNameEn && <p className="text-xs text-red-500">{errors.stageNameEn?.message}</p>}
            </div>

            {/* Korean stage name */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="stageNameKr">Stage Name (KR)</Label>
              <Input type="text" id="stageNameKr" placeholder="Korean Stage name..." {...register('stageNameKr')} />
              {errors.stageNameKr && <p className="text-xs text-red-500">{errors.stageNameKr?.message}</p>}
            </div>

            {/* Instagram */}
            <div className="flex flex-col gap-1.5 col-span-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input type="text" id="instagram" placeholder="Instagram..." {...register('instagram')} />
              {errors.instagram && <p className="text-xs text-red-500">{errors.instagram?.message}</p>}
            </div>

            {/* Image */}
            <div className="flex flex-col gap-1.5 col-span-2">
              <Label htmlFor="image">Image</Label>
              <Controller
                control={control}
                name="image"
                render={({ field: { onChange } }) => (
                  <ImageUpload folder="members" onImageUploaded={onChange} />
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
    </Dialog >

  )
}