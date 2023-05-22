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
import { type Artist, type Company } from "~/server/db/schema"

import DeleteArtist from "./delete-artist"
import UpdateArtist from "./update-artist"

type Props = {
  row: Row<Artist>
  companies: Company[]
}

export default function ArtistTableActions({ row, companies }: Props) {
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
            <Link href={{ pathname: `/admin/artists/${row.original.id}` }}>View</Link>
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

      <UpdateArtist
        artist={row.original}
        companies={companies}
        open={openEditForm}
        setOpen={setOpenEditForm}
        data-superjson
      />
      <DeleteArtist artist={row.original} open={openDeleteForm} setOpen={setOpenDeleteForm} />
    </>
  )
}
