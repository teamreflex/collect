import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Trash } from "lucide-react"
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
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog"
import { Button } from "~/components/ui/button"
import { useToast } from "~/hooks/use-toast"
import { api } from "~/lib/api/client"
import {
  deletePhotocardSetSchema,
  type DeletePhotocardSetSchema,
  type PhotocardSet,
} from "~/server/db/schema"

type Props = {
  photocardSet: PhotocardSet
}

export default function DeletePhotocardSet({ photocardSet }: Props) {
  const { toast } = useToast()

  const { handleSubmit, reset } = useForm<DeletePhotocardSetSchema>({
    resolver: zodResolver(deletePhotocardSetSchema),
    defaultValues: { id: photocardSet.id },
  })

  const router = useRouter()
  const { mutate: deletePhotocardSet, isLoading } = api.photocardSets.delete.useMutation({
    onSuccess() {
      router.refresh()
      reset()
      toast({
        description: (
          <p>
            Photocard set <span className="font-semibold">{photocardSet.name}</span> deleted
          </p>
        ),
      })
    },
  })

  function onSubmit(data: DeletePhotocardSetSchema) {
    deletePhotocardSet(data)
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive-ghost">
          <Trash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            <strong>{photocardSet.name}</strong> and all of its data.
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
