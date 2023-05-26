"use client"

import { useState } from "react"
import Link from "next/link"
import { type Row } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { type Album } from "~/server/db/schema"

import DeleteAlbum from "../albums/delete-album"
import UpdateAlbum from "../albums/update-album"

type Props = {
  row: Row<Album>
}

export default function AlbumTableActions({ row }: Props) {
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
          <DropdownMenuItem asChild>
            <Link href={{ pathname: `/admin/albums/${row.original.id}` }}>View</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpenEditForm(true)}>Edit</DropdownMenuItem>
          <DropdownMenuItem
            className="focus:bg-destructive"
            onClick={() => setOpenDeleteForm(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UpdateAlbum album={row.original} open={openEditForm} setOpen={setOpenEditForm} />
      <DeleteAlbum album={row.original} open={openDeleteForm} setOpen={setOpenDeleteForm} />
    </>
  )
}
