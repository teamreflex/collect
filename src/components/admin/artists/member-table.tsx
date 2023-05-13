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
import { type Artist, type Member } from "~/server/db/schema"

import CreateMember from "../members/create-member"
import MemberTableActions from "./member-table-actions"

function buildColumns(artist: Artist): ColumnDef<Member>[] {
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
      accessorKey: "stageNameEn",
      header: "Stage Name (EN)",
    },
    {
      id: "actions",
      cell: ({ row }) => <MemberTableActions row={row} artist={artist} />,
    },
  ]
}

type MemberTableProps = {
  data: Member[]
  artist: Artist
}

export default function MemberTable({ data, artist }: MemberTableProps) {
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
          placeholder="Filter members..."
          value={table.getColumn("stageNameEn")?.getFilterValue() as string}
          onChange={(event) => table.getColumn("stageNameEn")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />

        <CreateMember artist={artist} />
      </div>

      {/* table */}
      <DataTable table={table} columns={columns} />
    </div>
  )
}
