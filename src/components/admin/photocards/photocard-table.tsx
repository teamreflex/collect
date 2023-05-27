"use client"

import { useState } from "react"
import Image from "next/image"
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table"
import { DataTable } from "~/components/ui/data-table"
import { Input } from "~/components/ui/input"
import { type PhotocardWithContent } from "~/server/db/types"

import PhotocardTableActions from "./photocard-table-actions"

function buildColumns(): ColumnDef<PhotocardWithContent>[] {
  return [
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => {
        return (
          <div className="relative aspect-photocard max-h-14">
            <Image
              className="rounded-md"
              alt={row.getValue("name")}
              src={row.getValue("image")}
              fill={true}
            />
          </div>
        )
      },
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "artist.nameEn",
      header: "Artist",
    },
    {
      accessorKey: "photocardSet.album.name",
      header: "Album",
    },

    {
      id: "members",
      header: "Member",
      accessorFn: (row) =>
        row.members.length > 0
          ? row.members.map((member) => member.member.nameEn).join(", ")
          : "N/A",
    },
    {
      id: "actions",
      cell: ({ row }) => <PhotocardTableActions row={row} />,
    },
  ]
}

type PhotocardTableProps = {
  data: PhotocardWithContent[]
}

export default function PhotocardTable({ data }: PhotocardTableProps) {
  const columns = buildColumns()
  const [filter, setFilter] = useState("")

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setFilter,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter: filter,
    },
  })

  return (
    <div className="flex w-full flex-col gap-2">
      {/* filter */}
      <div className="flex items-center justify-between gap-2">
        <Input
          placeholder="Filter photocards..."
          value={filter}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* table */}
      <DataTable table={table} columns={columns} />
    </div>
  )
}
