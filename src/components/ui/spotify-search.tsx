import { useState } from "react"
import Image from "next/image"
import { Check, ChevronsUpDown, ImagePlus, Loader2 } from "lucide-react"
import { useDebounce } from "usehooks-ts"
import { Button } from "~/components/ui/button"
import { Command, CommandInput, CommandItem } from "~/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { useToast } from "~/hooks/use-toast"
import { api } from "~/lib/api/client"
import { type SpotifyOption } from "~/lib/spotify"
import { cn } from "~/lib/utils"

import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip"

type Props = {
  searchType: "album" | "artist"
  value: string | null | undefined
  onSelected: (spotifyId: string | null) => void
  onImageSelected: (url: string) => void
}

export function SpotifySearch({ onSelected, onImageSelected, value, searchType }: Props) {
  const { toast } = useToast()

  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<SpotifyOption[]>([])
  const [selected, setSelected] = useState<SpotifyOption | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearch = useDebounce<string>(searchTerm, 500)

  const { isFetching } = api.spotify.search.useQuery(
    { type: searchType, searchTerm: debouncedSearch },
    {
      enabled: debouncedSearch.length >= 2,
      onSuccess(data) {
        if (selected && data.findIndex((a) => a.id === selected.id) === -1) {
          setOptions([selected, ...data])
        } else {
          setOptions(data)
        }
      },
    },
  )

  function select(option: SpotifyOption | null) {
    setSelected(option)
    setOpen(false)
    onSelected(option?.id ?? null)
  }

  // database only stores the spotify id, so we need to fetch the full object
  const [hasLoaded, setHasLoaded] = useState(value === null || value === undefined)
  const { isFetching: isFetchingInitialValue } = api.spotify.fetchRecord.useQuery(
    { type: searchType, spotifyId: value as string },
    {
      enabled: hasLoaded === false,
      onSuccess(data) {
        setOptions([...options, data])
        setSelected(data)
        setHasLoaded(true)
      },
    },
  )

  function handleImageCopy() {
    if (selected) {
      onImageSelected(selected.imageUrl)
      toast({
        description: <p>Spotify image copied into {searchType}</p>,
      })
    }
  }

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
            {!value && <span>{`Search for an ${searchType}...`}</span>}
            {value && isFetchingInitialValue && <Loader2 className="h-4 w-4 animate-spin" />}
            {value && selected && <span>{options.find((opt) => opt.id === value)?.name}</span>}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command shouldFilter={false}>
            <CommandInput onValueChange={setSearchTerm} placeholder={`Search ${searchType}s...`} />
            {isFetching && (
              <div className="flex items-center justify-center py-5 text-center text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            )}
            {!isFetching && options.length === 0 && (
              <div className="flex items-center justify-center py-6 text-center text-sm text-muted-foreground">
                {`No ${searchType}s found`}
              </div>
            )}
            {!isFetching &&
              options.map((opt) => (
                <CommandItem
                  className="flex flex-row justify-between"
                  key={opt.id}
                  value={opt.id}
                  onSelect={(currentValue) => {
                    select(currentValue === value ? null : opt)
                  }}
                >
                  <div className="flex flex-row">
                    <Check
                      className={cn("mr-2 h-4 w-4", value === opt.id ? "opacity-100" : "opacity-0")}
                    />
                    {opt.name}
                  </div>
                  {opt.imageUrl && (
                    <Image
                      className="rounded-md"
                      src={opt.imageUrl}
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

      <div className="flex items-center">
        {selected && (
          <Tooltip>
            <TooltipTrigger asChild>
              <ImagePlus
                className="text-foreground hover:cursor-pointer"
                onClick={handleImageCopy}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy image from Spotify</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  )
}
