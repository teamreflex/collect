import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { GB, KR, JP } from 'country-flag-icons/react/3x2'
import { Globe2 } from "lucide-react"
import { cn } from "~/lib/utils"

type Props = {
  region: "en" | "kr" | "jp" | "other"
}

const name: Record<Props['region'], string> = {
  en: "English",
  kr: "Korean",
  jp: "Japanese",
  other: "Other",
}

export default function AlbumRegionIcon({ region }: Props) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={cn(region !== 'other' && "border border-slate-950", "rounded w-10 h-fit overflow-clip")}>
          {region === 'en' && <GB />}
          {region === 'kr' && <KR />}
          {region === 'jp' && <JP />}
          {region === 'other' && <Globe2 />}
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p className="font-normal tracking-normal">{name[region]} release</p>
      </TooltipContent>
    </Tooltip>
  )
}