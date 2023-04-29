'use client'

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
import { Switch } from "~/components/ui/switch"

export default function CreateArtist() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="default">Create Artist</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Artist</DialogTitle>
          <DialogDescription>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              {/* English name */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="nameEn">Name (EN)</Label>
                <Input type="text" id="nameEn" placeholder="English name..." />
              </div>

              {/* Korean name */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="nameKr">Name (KR)</Label>
                <Input type="text" id="nameKr" placeholder="Korean name..." />
              </div>

              {/* Twitter */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="twitter">Twitter</Label>
                <Input type="text" id="twitter" placeholder="Twitter..." />
              </div>

              {/* Instagram */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="instagram">Instagram</Label>
                <Input type="text" id="instagram" placeholder="Instagram..." />
              </div>

              {/* YouTube */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="youtube">YouTube</Label>
                <Input type="text" id="youtube" placeholder="YouTube..." />
              </div>

              {/* Website */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="website">Website</Label>
                <Input type="text" id="website" placeholder="Website..." />
              </div>

              {/* Debut */}
              <div className="flex flex-col gap-1.5 col-span-2">
                <Label htmlFor="debut">Debut Date</Label>
                <Input type="text" id="debut" placeholder="2017/06/26" />
              </div>

              {/* Company */}
              <div className="flex flex-col gap-1.5 col-span-2">
                <Label htmlFor="companyId">Company/Agency</Label>
                <Input type="text" id="companyId" placeholder="Select a company..." />
              </div>

              {/* Is Group */}
              <div className="flex items-center space-x-2 col-span-2">
                <Switch id="isGroup" />
                <Label htmlFor="isGroup">Is Group</Label>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

  )
}