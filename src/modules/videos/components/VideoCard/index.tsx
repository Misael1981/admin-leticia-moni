import Image from "next/image"
import Link from "next/link"
import { Clock3, Eye, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { VideoType } from "../../queries/get-videos.queries"

type VideoCardProps = {
  video: VideoType | null
}

export function VideoCard({ video }: VideoCardProps) {
  return (
    <article className="group bg-background overflow-hidden rounded-xl border transition hover:shadow-md">
      <Link href={`/videos/${video?.id}`}>
        <div className="aspect relative h-60 w-full overflow-hidden bg-(--color-cream)">
          <Image
            src={video?.thumbnailUrl || "/logo.svg"}
            alt={video?.name || "Capa do Video Treino"}
            fill
            className="object-contain transition duration-300 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="space-y-3 p-3">
        <div>
          <h3 className="line-clamp-2 font-medium">{video?.name}</h3>

          <div className="text-muted-foreground mt-1 flex items-center gap-2 text-xs">
            {video?.category && <span>{video?.category}</span>}

            {video?.durationSeconds && (
              <>
                <span>•</span>

                <span className="flex items-center gap-1">
                  <Clock3 className="size-3" />
                  {Math.floor(video?.durationSeconds / 60)}:
                  {(video?.durationSeconds % 60).toString().padStart(2, "0")}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Button size="sm" variant="secondary" asChild>
            <Link href={`/videos/${video?.id}`}>
              <Eye className="mr-2 size-4" />
              Abrir
            </Link>
          </Button>

          <div className="flex gap-1">
            <Button size="icon" variant="ghost">
              <Pencil className="size-4" />
            </Button>

            <Button size="icon" variant="ghost">
              <Trash2 className="text-destructive size-4" />
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}
