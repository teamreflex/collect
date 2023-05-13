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
  deleteAlbumVersionSchema,
  type AlbumVersion,
  type DeleteAlbumVersionSchema,
} from "~/server/db/schema"

type Props = {
  version: AlbumVersion
}

export default function DeleteAlbumVersion({ version }: Props) {
  const { toast } = useToast()

  const { handleSubmit, reset } = useForm<DeleteAlbumVersionSchema>({
    resolver: zodResolver(deleteAlbumVersionSchema),
    defaultValues: { id: version.id },
  })

  const router = useRouter()
  const { mutate: deleteVersion, isLoading } = api.albumVersions.delete.useMutation({
    onSuccess() {
      router.refresh()
      reset()
      toast({
        description: (
          <p>
            Album version <span className="font-semibold">{version.name}</span> deleted
          </p>
        ),
      })
    },
  })

  function onSubmit(data: DeleteAlbumVersionSchema) {
    deleteVersion(data)
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
            <strong>{version.name}</strong> and all of its data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="destructive" onClick={handleSubmit(onSubmit)}>
              Delete
              {isLoading && <Loader2 className="ml-2 w-4 animate-spin" />}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
