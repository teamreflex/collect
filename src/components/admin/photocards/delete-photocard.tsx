import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog"
import { Button } from "~/components/ui/button"
import { useToast } from "~/hooks/use-toast"
import { api } from "~/lib/api/client"
import { deletePhotocardSchema, type DeletePhotocardSchema } from "~/server/db/schema"

type Props = {
  name: string
  id: DeletePhotocardSchema["id"]
  open: boolean
  setOpen: (open: boolean) => void
}

export default function DeletePhotocard({ name, id, open, setOpen }: Props) {
  const { toast } = useToast()

  const { handleSubmit, reset } = useForm<DeletePhotocardSchema>({
    resolver: zodResolver(deletePhotocardSchema),
    defaultValues: { id },
  })

  const router = useRouter()
  const { mutate: deletePhotocard, isLoading } = api.photocards.delete.useMutation({
    onSuccess() {
      router.refresh()
      reset()
      toast({
        description: (
          <p>
            Photocard <span className="font-semibold">{name}</span> deleted
          </p>
        ),
      })
    },
  })

  function onSubmit(data: DeletePhotocardSchema) {
    deletePhotocard(data)
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete <strong>{name}</strong> and
            all of its data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="destructive" onClick={handleSubmit(onSubmit)} disabled={isLoading}>
              Delete
              {isLoading && <Loader2 className="ml-2 w-4 animate-spin" />}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
