'use client'

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Loader2 } from "lucide-react";
import { useToast } from "~/hooks/use-toast";
import ImageUpload from "~/components/ui/image-upload";
import { type CreateCompanySchema, createCompanySchema } from "~/server/db/schema";
import { Plus } from "lucide-react";

export default function CreateCompany() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const { control, register, handleSubmit, reset, formState: { errors } } = useForm<CreateCompanySchema>({
    resolver: zodResolver(createCompanySchema)
  });

  const router = useRouter();
  const { mutate: createCompany, isLoading } = api.companies.create.useMutation({
    onSuccess(_, newData) {
      router.refresh();
      setOpen(false);
      reset();
      toast({
        description: <p>Company <span className="font-semibold">{newData.nameEn}</span> created</p>,
      });
    },
  });

  function onSubmit(data: CreateCompanySchema) {
    createCompany(data);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="flex flex-row gap-1">
          <Plus /> Create Company
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Create Company</DialogTitle>
            <DialogDescription>
              Create a new company.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 py-4">
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

            {/* Image */}
            <div className="flex flex-col gap-1.5 col-span-2">
              <Label htmlFor="image">Image</Label>
              <Controller
                control={control}
                name="image"
                render={({ field: { onChange } }) => (
                  <ImageUpload folder="companies" onImageUploaded={onChange} />
                )} />

              {errors.image && <p className="text-xs text-red-500">{errors.image?.message}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button type="reset" variant="outline" onClick={() => reset()}>Reset</Button>
            <Button type="submit">
              Save
              {isLoading && <Loader2 className="animate-spin ml-2 w-4" />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}