import { usePathname, useRouter } from "next/navigation"
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
import { deleteArtistSchema, type Artist, type DeleteArtistSchema } from "~/server/db/schema"

type Props = {
  artist: Artist
  open: boolean
  setOpen: (open: boolean) => void
}

export default function DeleteArtist({ artist, open, setOpen }: Props) {
  const { toast } = useToast()

  const { handleSubmit, reset } = useForm<DeleteArtistSchema>({
    resolver: zodResolver(deleteArtistSchema),
    defaultValues: { id: artist.id },
  })

  const router = useRouter()
  const pathname = usePathname()
  const { mutate: deleteArtist, isLoading } = api.artists.delete.useMutation({
    onSuccess() {
      // handle different locations this button may be
      if (pathname === `/admin/artists/${artist.id}`) {
        router.push("/admin/artists")
      } else {
        router.refresh()
      }
      reset()
      toast({
        description: (
          <p>
            Artist <span className="font-semibold">{artist.nameEn}</span> deleted
          </p>
        ),
      })
    },
  })

  function onSubmit(data: DeleteArtistSchema) {
    deleteArtist(data)
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            <strong>{artist.nameEn}</strong> and all of its data.
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
