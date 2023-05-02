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

export const deleteMemberSchema = z.object({
  id: z.number().positive(),
});
type DeleteMemberSchema = z.infer<typeof deleteMemberSchema>;

export default function DeleteMember({ name, id, size = 'default' }: { name: string, id: DeleteMemberSchema['id'], size?: 'sm' | 'default' }) {
  const { toast } = useToast();

  const { handleSubmit, reset } = useForm<DeleteMemberSchema>({
    resolver: zodResolver(deleteMemberSchema),
    defaultValues: { id }
  });

  const router = useRouter();
  const { mutate: deleteMember, isLoading } = api.members.delete.useMutation({
    onSuccess() {
      reset();
      toast({
        description: <p>Member <span className="font-semibold">{name}</span> deleted</p>,
      })
      router.refresh();
    },
  });

  function onSubmit(data: DeleteMemberSchema) {
    deleteMember(data);
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