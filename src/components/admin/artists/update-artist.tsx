import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { Calendar, Loader2 } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { Button } from "~/components/ui/button"
import { Calendar as CalendarInput } from "~/components/ui/calendar"
import { Checkbox } from "~/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import ImageUpload from "~/components/ui/image-upload"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { SpotifySearch } from "~/components/search/spotify-search"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { useToast } from "~/hooks/use-toast"
import { api } from "~/lib/api/client"
import { cn } from "~/lib/utils"
import { updateArtistSchema, type Company, type UpdateArtistSchema } from "~/server/db/schema"

type UpdateArtistProps = {
  companies: Company[]
  artist: UpdateArtistSchema
  open: boolean
  setOpen: (open: boolean) => void
}

export default function UpdateArtist({ companies, artist, open, setOpen }: UpdateArtistProps) {
  const { toast } = useToast()

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<UpdateArtistSchema>({
    resolver: zodResolver(updateArtistSchema),
    defaultValues: {
      ...artist,
    },
  })

  const router = useRouter()
  const { mutate: updateArtist, isLoading } = api.artists.update.useMutation({
    onSuccess(_, newData) {
      router.refresh()
      setOpen(false)
      reset(newData)
      toast({
        description: (
          <p>
            Artist <span className="font-semibold">{newData.nameEn}</span> updated
          </p>
        ),
      })
    },
  })

  function onSubmit(data: UpdateArtistSchema) {
    updateArtist(data)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Update Artist</DialogTitle>
            <DialogDescription>Update an existing artist.</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 py-4 lg:grid-cols-2">
            {/* English name */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nameEn">Name (EN)</Label>
              <Input
                type="text"
                id="nameEn"
                placeholder="English name..."
                {...register("nameEn")}
              />
              {errors.nameEn && <p className="text-xs text-red-500">{errors.nameEn?.message}</p>}
            </div>

            {/* Korean name */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nameKr">Name (KR)</Label>
              <Input type="text" id="nameKr" placeholder="Korean name..." {...register("nameKr")} />
              {errors.nameKr && <p className="text-xs text-red-500">{errors.nameKr?.message}</p>}
            </div>

            {/* Twitter */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="twitter">Twitter</Label>
              <Input type="text" id="twitter" placeholder="Twitter..." {...register("twitter")} />
              {errors.twitter && <p className="text-xs text-red-500">{errors.twitter?.message}</p>}
            </div>

            {/* Instagram */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                type="text"
                id="instagram"
                placeholder="Instagram..."
                {...register("instagram")}
              />
              {errors.instagram && (
                <p className="text-xs text-red-500">{errors.instagram?.message}</p>
              )}
            </div>

            {/* YouTube */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="youtube">YouTube</Label>
              <Input type="text" id="youtube" placeholder="YouTube..." {...register("youtube")} />
              {errors.youtube && <p className="text-xs text-red-500">{errors.youtube?.message}</p>}
            </div>

            {/* Website */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="website">Website</Label>
              <Input type="text" id="website" placeholder="Website..." {...register("website")} />
              {errors.website && <p className="text-xs text-red-500">{errors.website?.message}</p>}
            </div>

            {/* Spotify */}
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="spotifyId">Spotify</Label>
              <Controller
                control={control}
                name="spotifyId"
                render={({ field: { onChange, value } }) => (
                  <SpotifySearch
                    searchType="artist"
                    onSelected={onChange}
                    onImageSelected={(e) => setValue("image", e)}
                    value={value}
                  />
                )}
              />
              {errors.spotifyId && (
                <p className="text-xs text-red-500">{errors.spotifyId?.message}</p>
              )}
            </div>

            {/* Debut */}
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="debut">Debut Date</Label>
              <Controller
                control={control}
                name="debut"
                render={({ field: { onChange, value } }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "justify-start text-left font-normal",
                          !value && "text-muted-foreground",
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {value ? format(value, "yyyy-MM-dd") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarInput mode="single" selected={value} onSelect={onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.debut && <p className="text-xs text-red-500">{errors.debut?.message}</p>}
            </div>

            {/* Company */}
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="companyId">Company</Label>
              <Controller
                control={control}
                name="companyId"
                render={({ field: { onChange, value } }) => (
                  <Select value={value?.toString()} onValueChange={(v) => onChange(Number(v))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a company..." />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id.toString()}>
                          {company.nameEn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.companyId && (
                <p className="text-xs text-red-500">{errors.companyId?.message}</p>
              )}
            </div>

            {/* Image */}
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="image">Image</Label>
              <Controller
                control={control}
                name="image"
                render={({ field: { onChange } }) => (
                  <ImageUpload folder="companies" onImageUploaded={onChange} />
                )}
              />

              {errors.image && <p className="text-xs text-red-500">{errors.image?.message}</p>}
            </div>

            {/* Is Group */}
            <div className="col-span-2 flex items-center space-x-2">
              <Controller
                control={control}
                name="isGroup"
                render={({ field: { onChange, value, ref } }) => (
                  <Checkbox id="isGroup" onCheckedChange={onChange} checked={value} ref={ref} />
                )}
              />
              <Label htmlFor="isGroup">Is Group?</Label>
              {errors.isGroup && <p className="text-xs text-red-500">{errors.isGroup?.message}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              Update
              {isLoading && <Loader2 className="ml-2 w-4 animate-spin" />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
