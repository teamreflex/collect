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
import { type Company } from "~/server/db/schema"

import DeleteCompany from "./delete-company"
import UpdateCompany from "./update-company"

type Props = {
  row: Row<Company>
}

export default function CompanyTableActions({ row }: Props) {
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

      <UpdateCompany company={row.original} open={openEditForm} setOpen={setOpenEditForm} />
      <DeleteCompany
        id={row.original.id}
        name={row.original.nameEn}
        open={openDeleteForm}
        setOpen={setOpenDeleteForm}
      />
    </>
  )
}
