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
import { useToast } from "~/hooks/use-toast";
import { usePathname } from "next/navigation";

export const deleteArtistSchema = z.object({
  id: z.number().positive(),
});
type DeleteArtistSchema = z.infer<typeof deleteArtistSchema>;

export default function DeleteArtist({ name, id, size = 'default' }: { name: string, id: DeleteArtistSchema['id'], size?: 'sm' | 'default' }) {
  const { toast } = useToast();

  const { handleSubmit, reset } = useForm<DeleteArtistSchema>({
    resolver: zodResolver(deleteArtistSchema),
    defaultValues: { id }
  });

  const router = useRouter();
  const pathname = usePathname();
  const { mutate: deleteArtist, isLoading } = api.artists.delete.useMutation({
    onSuccess() {
      // handle different locations this button may be
      if (pathname === `/admin/artists/${id}`) {
        router.push('/admin/artists');
      } else {
        router.refresh();
      }
      reset();
      toast({
        description: <p>Artist <span className="font-semibold">{name}</span> deleted</p>,
      });
    },
  });

  function onSubmit(data: DeleteArtistSchema) {
    deleteArtist(data);
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="flex flex-row gap-1" size={size}>
          <Trash /> Delete
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