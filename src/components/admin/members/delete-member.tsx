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
import { deleteMemberSchema, type DeleteMemberSchema } from "~/server/db/schema"

export default function DeleteMember({
  name,
  id,
  size = "default",
}: {
  name: string
  id: DeleteMemberSchema["id"]
  size?: "sm" | "default"
}) {
  const { toast } = useToast()

  const { handleSubmit, reset } = useForm<DeleteMemberSchema>({
    resolver: zodResolver(deleteMemberSchema),
    defaultValues: { id },
  })

  const router = useRouter()
  const { mutate: deleteMember, isLoading } = api.members.delete.useMutation({
    onSuccess() {
      router.refresh()
      reset()
      toast({
        description: (
          <p>
            Member <span className="font-semibold">{name}</span> deleted
          </p>
        ),
      })
    },
  })

  function onSubmit(data: DeleteMemberSchema) {
    deleteMember(data)
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
