"use client"

import { useState } from "react"
import Image from "next/image"
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
} from "@tanstack/react-table"
import { DataTable } from "~/components/ui/data-table"
import { Input } from "~/components/ui/input"
import { type AlbumWithContent } from "~/server/db/albums"

import AlbumTableActions from "../artists/album-table-actions"

function buildColumns(): ColumnDef<AlbumWithContent>[] {
  return [
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => {
        return (
          <Image
            className="rounded-md"
            alt={row.getValue("name")}
            src={row.getValue("image")}
            width={50}
            height={50}
          />
        )
      },
    },
    {
      accessorKey: "artist.nameEn",
      header: "Artist",
      enableColumnFilter: true,
    },
    {
      accessorKey: "name",
      header: "Name",
      enableColumnFilter: true,
    },
    {
      accessorKey: "region",
      header: "Region",
    },
    {
      id: "actions",
      cell: ({ row }) => <AlbumTableActions row={row} />,
    },
  ]
}

type AlbumTableProps = {
  data: AlbumWithContent[]
}

export default function AlbumTable({ data }: AlbumTableProps) {
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
          placeholder="Filter artist or albums..."
          value={filter}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />

        {/* <CreateAlbum artist={artist} /> */}
      </div>

      {/* table */}
      <DataTable table={table} columns={columns} />
    </div>
  )
}
