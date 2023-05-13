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
import { deleteMemberSchema, type DeleteMemberSchema, type Member } from "~/server/db/schema"

type Props = {
  member: Member
  open: boolean
  setOpen: (open: boolean) => void
}

export default function DeleteMember({ member, open, setOpen }: Props) {
  const { toast } = useToast()

  const { handleSubmit, reset } = useForm<DeleteMemberSchema>({
    resolver: zodResolver(deleteMemberSchema),
    defaultValues: { id: member.id },
  })

  const router = useRouter()
  const { mutate: deleteMember, isLoading } = api.members.delete.useMutation({
    onSuccess() {
      router.refresh()
      reset()
      toast({
        description: (
          <p>
            Member <span className="font-semibold">{member.stageNameEn}</span> deleted
          </p>
        ),
      })
    },
  })

  function onSubmit(data: DeleteMemberSchema) {
    deleteMember(data)
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            <strong>{member.stageNameEn}</strong> and all of its data.
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
