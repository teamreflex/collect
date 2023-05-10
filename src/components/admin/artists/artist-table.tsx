"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
} from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Button } from "~/components/ui/button"
import { DataTable } from "~/components/ui/data-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Input } from "~/components/ui/input"
import { type Artist, type Company } from "~/server/db/schema"

import CreateArtist from "./create-artist"
import DeleteArtist from "./delete-artist"
import UpdateArtist from "./update-artist"

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
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>
                <Link href={{ pathname: `/admin/artists/${row.original.id}` }}>View</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <UpdateArtist artist={row.original} companies={companies} />
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-destructive">
                <DeleteArtist id={row.original.id} name={row.original.nameEn} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
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
      <div className="flex justify-between gap-2">
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
