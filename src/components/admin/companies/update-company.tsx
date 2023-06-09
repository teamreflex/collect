import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
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
import { useToast } from "~/hooks/use-toast"
import { api } from "~/lib/api/client"
import { updateCompanySchema, type Company, type UpdateCompanySchema } from "~/server/db/schema"

type UpdateCompanyProps = {
  company: Company
  open: boolean
  setOpen: (open: boolean) => void
}

export default function UpdateCompany({ company, open, setOpen }: UpdateCompanyProps) {
  const { toast } = useToast()

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateCompanySchema>({
    resolver: zodResolver(updateCompanySchema),
    defaultValues: {
      ...company,
    },
  })

  const router = useRouter()
  const { mutate: updateCompany, isLoading } = api.companies.update.useMutation({
    onSuccess(_, newData) {
      router.refresh()
      setOpen(false)
      reset(newData)
      toast({
        description: (
          <p>
            Company <span className="font-semibold">{newData.nameEn}</span> updated
          </p>
        ),
      })
    },
  })

  function onSubmit(data: UpdateCompanySchema) {
    updateCompany(data)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Update Company</DialogTitle>
            <DialogDescription>Update an existing company.</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 py-4 lg:grid-cols-2">
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
