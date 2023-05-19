import * as React from "react"
import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"

type Option = { label: string; value: number }
type Props = {
  value: number[]
  onChange: (value: number[]) => void
  options: Option[]
}

export function AlbumVersionSelector({ value, onChange, options }: Props) {
  function select(option: Option) {
    if (value.includes(option.value)) {
      onChange(value.filter((v) => v !== option.value))
    } else {
      onChange([...value, option.value])
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {value.length === 0
            ? "Select versions..."
            : options
                .filter((o) => value.includes(o.value))
                .map((o) => o.label)
                .join(", ")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full">
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={value.includes(option.value)}
            onCheckedChange={() => select(option)}
          >
            {option.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
