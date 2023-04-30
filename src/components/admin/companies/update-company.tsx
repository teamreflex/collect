'use client'

import { useForm } from "react-hook-form"
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
import { api } from "~/lib/api/client";
import { useRouter } from "next/navigation";
import { Edit, Loader2 } from "lucide-react";

export const updateCompanySchema = z.object({
  id: z.number().positive(),
  nameEn: z.string().min(1),
  nameKr: z.string().min(1),
  image: z.string().min(1),
});
type UpdateCompanySchema = z.infer<typeof updateCompanySchema>;

export default function UpdateCompany({ id, nameEn, nameKr, image }: UpdateCompanySchema) {
  const [open, setOpen] = useState(false);

  const { register, handleSubmit, reset } = useForm<UpdateCompanySchema>({
    resolver: zodResolver(updateCompanySchema),
    defaultValues: {
      id,
      nameEn,
      nameKr,
      image,
    },
  });

  const router = useRouter();
  const { mutate: updateCompany, isLoading } = api.companies.update.useMutation({
    onSuccess(_, newData) {
      setOpen(false);
      reset(newData);
      router.refresh();
    },
  });

  function onSubmit(data: UpdateCompanySchema) {
    updateCompany(data);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          <Edit />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Update Company</DialogTitle>
            <DialogDescription>
              Update an existing company.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 py-4">
            {/* English name */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nameEn">Name (EN)</Label>
              <Input type="text" id="nameEn" placeholder="English name..." {...register('nameEn')} />
            </div>

            {/* Korean name */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nameKr">Name (KR)</Label>
              <Input type="text" id="nameKr" placeholder="Korean name..." {...register('nameKr')} />
            </div>

            {/* Image */}
            <div className="flex flex-col gap-1.5 col-span-2">
              <Label htmlFor="image">Image</Label>
              <Input type="text" id="image" placeholder="Upload an image..." {...register('image')} />
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