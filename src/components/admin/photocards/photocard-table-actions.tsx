"use client"

import { useState } from "react"
import { type Row } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { type PhotocardWithContent } from "~/server/db/types"

import DeletePhotocard from "./delete-photocard"
import UpdatePhotocard from "./update-photocard"

type Props = {
  row: Row<PhotocardWithContent>
}

export default function PhotocardTableActions({ row }: Props) {
  const [openEditForm, setOpenEditForm] = useState(false)
  const [openDeleteForm, setOpenDeleteForm] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setOpenEditForm(true)}>Edit</DropdownMenuItem>
          <DropdownMenuItem
            className="focus:bg-destructive"
            onClick={() => setOpenDeleteForm(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* <UpdatePhotocard photocard={row.original} open={openEditForm} setOpen={setOpenEditForm} /> */}
      <DeletePhotocard
        id={row.original.id}
        name={row.original.name}
        open={openDeleteForm}
        setOpen={setOpenDeleteForm}
      />
    </>
  )
}
