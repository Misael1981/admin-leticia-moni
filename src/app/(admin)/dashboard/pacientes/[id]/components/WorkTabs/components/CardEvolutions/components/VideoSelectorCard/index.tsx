import { Checkbox } from "@/components/ui/checkbox"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { VideoType } from "@/modules/videos/queries/get-videos.queries"
import { Check } from "lucide-react"
import Image from "next/image"

type VideoSelectorCardProps = {
  video: VideoType | null
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

const VideoSelectorCard = ({
  video,
  checked,
  onCheckedChange,
}: VideoSelectorCardProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <label
          htmlFor={video?.id}
          className={cn(
            "group cursor-pointer overflow-hidden rounded-xl border transition-all",
            "hover:border-primary hover:shadow-md",
            checked && "border-primary ring-primary/20 ring-2",
          )}
        >
          <div className="relative h-20 w-full overflow-hidden">
            <Image
              src={video?.thumbnailUrl || "/logo.svg"}
              alt={video?.name || ""}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />

            <div className="absolute top-3 right-3">
              <div
                className={cn(
                  "bg-blue-dark flex h-7 w-7 items-center justify-center rounded-full shadow",
                  checked && "bg-primary text-primary-foreground",
                )}
              >
                {checked ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Checkbox
                    id={video?.id}
                    checked={checked}
                    onCheckedChange={(value) => onCheckedChange(value === true)}
                    className="bg-cream data-[state=checked]:bg-primary border-0"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="p-3">
            <h3 className="line-clamp-2 text-xs font-medium">{video?.name}</h3>
          </div>
        </label>
      </TooltipTrigger>

      <TooltipContent>
        <p>{video?.name}</p>
      </TooltipContent>
    </Tooltip>
  )
}

export default VideoSelectorCard
