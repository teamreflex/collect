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
import { type Artist, type Company } from "~/server/db/schema"

import ArtistTableActions from "./artist-table-actions"
import CreateArtist from "./create-artist"

function buildColumns(companies: Company[]): ColumnDef<Artist>[] {
  return [
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => {
        return (
          <Image
            className="rounded-md"
            alt={row.getValue("nameEn")}
            src={row.getValue("image")}
            width={50}
            height={50}
          />
        )
      },
    },
    {
      accessorKey: "nameEn",
      header: "Name (EN)",
    },
    {
      accessorKey: "nameKr",
      header: "Name (KR)",
    },
    {
      id: "actions",
      cell: ({ row }) => <ArtistTableActions row={row} companies={companies} />,
    },
  ]
}

type ArtistTableProps = {
  data: Artist[]
  companies: Company[]
}

export default function ArtistTable({ data, companies }: ArtistTableProps) {
  const columns = buildColumns(companies)
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
          placeholder="Filter artists..."
          value={table.getColumn("nameEn")?.getFilterValue() as string}
          onChange={(event) => table.getColumn("nameEn")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />

        <CreateArtist companies={companies} />
      </div>

      {/* table */}
      <DataTable table={table} columns={columns} />
    </div>
  )
}
