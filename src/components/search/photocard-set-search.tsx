import { useState } from "react"
import Image from "next/image"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { useDebounce } from "usehooks-ts"
import { Button } from "~/components/ui/button"
import { Command, CommandInput, CommandItem } from "~/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { api } from "~/lib/api/client"
import { cn } from "~/lib/utils"
import { type PhotocardSet } from "~/server/db/schema"

type Props = {
  value: number | string | undefined
  onSelected: (id: number | undefined) => void
}

export function PhotocardSetSearch({ onSelected, value }: Props) {
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<PhotocardSet[]>([])
  const [selected, setSelected] = useState<PhotocardSet | undefined>()
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearch = useDebounce<string>(searchTerm, 500)

  const { isFetching } = api.photocardSets.search.useQuery(debouncedSearch, {
    enabled: debouncedSearch.length >= 2,
    onSuccess(data) {
      if (selected && data.findIndex((a) => a.id === selected.id) === -1) {
        setOptions([selected, ...data])
      } else {
        setOptions(data)
      }
    },
  })

  function select(option?: PhotocardSet) {
    setSelected(option)
    setOpen(false)
    onSelected(option?.id)
  }

  const [hasLoaded, setHasLoaded] = useState(value === undefined)
  const { isFetching: isFetchingInitialValue } = api.photocardSets.fetch.useQuery(value as string, {
    enabled: hasLoaded === false,
    onSuccess(data) {
      if (data) {
        setOptions([...options, data])
      }
      setSelected(data)
      setHasLoaded(true)
    },
  })

  return (
    <div className={cn("flex w-full flex-row", selected ? "gap-2" : null)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between",
              selected ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {!value && <span>Search for a photocard set...</span>}
            {value && isFetchingInitialValue && <Loader2 className="h-4 w-4 animate-spin" />}
            {value && selected && (
              <span>{options.find((opt) => String(opt.id) === String(value))?.name}</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command shouldFilter={false}>
            <CommandInput onValueChange={setSearchTerm} placeholder="Search photocard sets..." />
            {isFetching && (
              <div className="flex items-center justify-center py-5 text-center text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            )}
            {!isFetching && options.length === 0 && (
              <div className="flex items-center justify-center py-6 text-center text-sm text-muted-foreground">
                No photocard sets found.
              </div>
            )}
            {!isFetching &&
              options.map((opt) => (
                <CommandItem
                  className="flex flex-row justify-between"
                  key={opt.id}
                  value={String(opt.id)}
                  onSelect={(currentValue) => {
                    select(currentValue === value ? undefined : opt)
                  }}
                >
                  <div className="flex flex-row">
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === String(opt.id) ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {opt.name}
                  </div>
                  {opt.image && (
                    <Image
                      className="rounded-md"
                      src={opt.image}
                      alt={opt.name}
                      height={40}
                      width={40}
                      unoptimized
                    />
                  )}
                </CommandItem>
              ))}
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
