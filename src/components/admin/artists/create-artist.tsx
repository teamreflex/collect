'use client'

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod"
import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Checkbox } from "~/components/ui/checkbox";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "~/components/ui/calendar";
import { format } from "date-fns";

export const createArtistSchema = z.object({
  nameEn: z.string().min(1),
  nameKr: z.string().min(1),
  debut: z.date(),
  companyId: z.number().positive(),
  isGroup: z.boolean(),
  image: z.string().min(1),
  twitter: z.string().min(1),
  instagram: z.string().min(1),
  youtube: z.string().min(1),
  website: z.string().min(1),
});
type CreateArtistSchema = z.infer<typeof createArtistSchema>;

export default function CreateArtist() {
  const [open, setOpen] = useState(false);

  const { control, register, handleSubmit, reset } = useForm<CreateArtistSchema>({
    resolver: zodResolver(createArtistSchema)
  });
  const onSubmit = data => console.log(data);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Create Artist</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Create Artist</DialogTitle>
            <DialogDescription>
              Create a new artist.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 py-4">
            {/* English name */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nameEn">Name (EN)</Label>
              <Input type="text" id="nameEn" placeholder="English name..." {...register('nameEn')} />
            </div>

            {/* Korean name */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nameKr">Name (KR)</Label>
              <Input type="text" id="nameKr" placeholder="Korean name..." {...register('nameKr')} />
            </div>

            {/* Twitter */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="twitter">Twitter</Label>
              <Input type="text" id="twitter" placeholder="Twitter..." {...register('twitter')} />
            </div>

            {/* Instagram */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="instagram">Instagram</Label>
              <Input type="text" id="instagram" placeholder="Instagram..." {...register('instagram')} />
            </div>

            {/* YouTube */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="youtube">YouTube</Label>
              <Input type="text" id="youtube" placeholder="YouTube..." {...register('youtube')} />
            </div>

            {/* Website */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="website">Website</Label>
              <Input type="text" id="website" placeholder="Website..." {...register('website')} />
            </div>

            {/* Debut */}
            <div className="flex flex-col gap-1.5 col-span-2">
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
                          !value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {value ? format(value, "yyyy-MM-dd") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={value}
                        onSelect={onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>

            {/* Company */}
            <div className="flex flex-col gap-1.5 col-span-2">
              <Label htmlFor="companyId">Company/Agency</Label>
              <Input type="text" id="companyId" placeholder="Select a company..." {...register('companyId')} />
            </div>

            {/* Image */}
            <div className="flex flex-col gap-1.5 col-span-2">
              <Label htmlFor="image">Image</Label>
              <Input type="text" id="image" placeholder="Upload an image..." {...register('image')} />
            </div>

            {/* Is Group */}
            <div className="flex items-center space-x-2 col-span-2">
              <Checkbox id="isGroup" {...register('isGroup')} />
              <Label htmlFor="isGroup">Is Group</Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="reset" variant="outline" onClick={() => reset()}>Reset</Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog >

  )
}