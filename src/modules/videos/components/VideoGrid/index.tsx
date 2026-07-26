import { Badge } from "@/components/ui/badge"
import { VideoType } from "../../queries/get-videos.queries"
import { VideoCard } from "../VideoCard"

type VideoGridProps = {
  videos: VideoType[] | null
}

const VideoGrid = ({ videos }: VideoGridProps) => {
  return (
    <section className="space-y-6">
      <div className="flex w-full flex-col items-center justify-center gap-4 lg:flex-row lg:justify-between">
        <h2 className="font-heading text-lg font-semibold lg:text-xl">
          Lista de vídeos treinos
        </h2>

        <Badge variant="outline">{videos?.length}</Badge>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        {videos?.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </section>
  )
}

export default VideoGrid
