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
import { type Album, type Artist, type Member } from "~/server/db/schema"

import AlbumTableActions from "./album-table-actions"
import CreateAlbum from "./create-album"

function buildColumns(artist: Artist): ColumnDef<Album>[] {
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
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "region",
      header: "Region",
    },
    {
      id: "actions",
      cell: ({ row }) => <AlbumTableActions row={row} artist={artist} />,
    },
  ]
}

type AlbumTableProps = {
  data: Album[]
  artist: Artist
}

export default function AlbumTable({ data, artist }: AlbumTableProps) {
  const columns = buildColumns(artist)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  })

  return (
    <div className="flex w-full flex-col gap-2">
      {/* filter */}
      <div className="flex items-center justify-between gap-2">
        <Input
          placeholder="Filter albums..."
          value={table.getColumn("name")?.getFilterValue() as string}
          onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />

        <CreateAlbum artist={artist} />
      </div>

      {/* table */}
      <DataTable table={table} columns={columns} />
    </div>
  )
}
