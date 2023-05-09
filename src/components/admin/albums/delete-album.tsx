"use client"

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
import { deleteAlbumSchema, type DeleteAlbumSchema } from "~/server/db/schema"

export default function DeleteAlbum({
  name,
  id,
  size = "default",
}: {
  name: string
  id: DeleteAlbumSchema["id"]
  size?: "sm" | "default"
}) {
  const { toast } = useToast()

  const { handleSubmit, reset } = useForm<DeleteAlbumSchema>({
    resolver: zodResolver(deleteAlbumSchema),
    defaultValues: { id },
  })

  const router = useRouter()
  const { mutate: deleteAlbum, isLoading } = api.albums.delete.useMutation({
    onSuccess() {
      router.refresh()
      reset()
      toast({
        description: (
          <p>
            Album <span className="font-semibold">{name}</span> deleted
          </p>
        ),
      })
    },
  })

  function onSubmit(data: DeleteAlbumSchema) {
    deleteAlbum(data)
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size={size}>
          <Trash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete <strong>{name}</strong> and
            all of its data.
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
