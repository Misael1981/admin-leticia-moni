"use client"

import Image from "next/image"
import Link from "next/link"
import { Clock3, Pencil, Play, Trash2, VideoIcon } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { VideoType } from "../../queries/get-videos.queries"
import { useState } from "react"
import { toast } from "sonner"
import DialogDeleteItem from "@/components/DialogDeleteItem"
import ModalPlayVideo from "../ModalPlayVideo"
import { deleteVideoAction } from "../../actions/delete-video"

type VideoCardProps = {
  video: VideoType | null
}

export function VideoCard({ video }: VideoCardProps) {
  const [isOpenModalDelete, setOpenModalDelete] = useState(false)
  const [isOpenModalPlayVideo, setOpenModalPlayVideo] = useState(false)

  const handleOpenModalDelete = () => {
    setOpenModalDelete(true)
  }

  const handleOpenModalPlayVideo = () => {
    setOpenModalPlayVideo(true)
  }

  const handleConfirmDelete = async () => {
    if (!video) {
      console.log("Vídeo não encontrado")
      return
    }

    try {
      const result = await deleteVideoAction(video.id)

      if (result.success) {
        setOpenModalDelete(false)
        toast.success(result.message ?? "Vídeo deletado com sucesso!")
      } else {
        toast.error(result.error ?? "Ocorreu um erro ao deletar o vídeo.")
        setOpenModalDelete(false)
      }
    } catch (error) {
      console.error("Erro ao deletar o vídeo:", error)
      toast.error("Ocorreu um erro ao deletar o vídeo.")
      setOpenModalDelete(false)
    }
  }

  return (
    <article className="group bg-background w-75 max-w-[95%] overflow-hidden rounded-xl border transition hover:shadow-md">
      <div
        className="aspect relative h-60 w-full overflow-hidden bg-(--color-cream)"
        onClick={handleOpenModalPlayVideo}
      >
        <Image
          src={video?.thumbnailUrl || "/logo.svg"}
          alt={video?.name || "Capa do Video Treino"}
          fill
          className="object-contain p-2 transition duration-300 group-hover:scale-105"
        />

        <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors duration-300 group-hover/btn:bg-black/40">
          <div className="text-primary flex h-12 w-12 items-center justify-center rounded-full bg-white/10 shadow-lg transition-transform duration-300 group-hover/btn:scale-110 group-hover/btn:bg-white">
            {/* Ícone de Play (Lucide React) */}
            <Play className="ml-1 h-6 w-6 fill-current" />
          </div>
        </div>
      </div>

      <div className="space-y-3 p-3">
        <div>
          <h3 className="truncate font-medium">{video?.name}</h3>

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
          <Button
            size="sm"
            variant="secondary"
            onClick={handleOpenModalPlayVideo}
          >
            <VideoIcon className="mr-2 size-4" />
            Abrir
          </Button>

          <div className="flex gap-1">
            <Link
              href={`/dashboard/videos/${video?.id}`}
              className={buttonVariants({ variant: "ghost" })}
            >
              <Pencil className="size-4" />
            </Link>

            <Button size="icon" variant="ghost" onClick={handleOpenModalDelete}>
              <Trash2 className="text-destructive size-4" />
            </Button>
          </div>
        </div>
      </div>

      <DialogDeleteItem
        isOpen={isOpenModalDelete}
        onClose={() => setOpenModalDelete(false)}
        onConfirm={handleConfirmDelete}
        label="Deseja realmente deletar esse vídeo? Essa ação é irreversível."
      />

      <ModalPlayVideo
        video={video}
        isOpen={isOpenModalPlayVideo}
        onClose={() => setOpenModalPlayVideo(false)}
      />
    </article>
  )
}
