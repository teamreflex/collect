'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod"
import { Button } from "~/components/ui/button"
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
import { api } from "~/lib/api/client";
import { useRouter } from "next/navigation";
import { Loader2, Trash } from "lucide-react";

export const deleteArtistSchema = z.object({
  id: z.number().positive(),
});
type DeleteArtistSchema = z.infer<typeof deleteArtistSchema>;

export default function DeleteArtist({ name, id }: { name: string, id: DeleteArtistSchema['id'] }) {
  const { handleSubmit, reset } = useForm<DeleteArtistSchema>({
    resolver: zodResolver(deleteArtistSchema),
    defaultValues: { id }
  });

  const router = useRouter();
  const { mutate: deleteArtist, isLoading } = api.artists.delete.useMutation({
    onSuccess() {
      reset();
      router.refresh();
    },
  });

  function onSubmit(data: DeleteArtistSchema) {
    deleteArtist(data);
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete <strong>{name}</strong> and all of its data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="destructive" onClick={handleSubmit(onSubmit)}>
              Delete
              {isLoading && <Loader2 className="animate-spin ml-2 w-4" />}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}