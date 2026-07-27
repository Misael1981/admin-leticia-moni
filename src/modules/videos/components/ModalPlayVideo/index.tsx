import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VideoType } from "../../queries/get-videos.queries"
import { VideoPlayer } from "../VideoPlayer"
import { getOptimizedVideoUrl } from "@/lib/cloudinary-url"

type ModalPlayVideoProps = {
  video: VideoType | null
  isOpen: boolean
  onClose: () => void
}

const ModalPlayVideo = ({ video, isOpen, onClose }: ModalPlayVideoProps) => {
  if (!video) return null

  const videoSrc = getOptimizedVideoUrl(video.cloudinaryPublicId, video.url)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex max-h-[90vh] w-100 max-w-[95%] flex-col gap-3 overflow-y-auto rounded-md p-0 shadow-md sm:max-w-sm md:p-4">
        <DialogTitle className="sr-only">{video.name}</DialogTitle>

        <VideoPlayer
          src={videoSrc}
          poster={video.thumbnailUrl}
          key={video.id}
          videoDate={video.createdAt}
          videoDescription={video.description}
          videoTitle={video.name}
        />
      </DialogContent>
    </Dialog>
  )
}

export default ModalPlayVideo
