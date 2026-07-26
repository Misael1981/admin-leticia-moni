"use client"

import Image from "next/image"
import Link from "next/link"
import { Clock3, Pencil, Trash2, VideoIcon } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { VideoType } from "../../queries/get-videos.queries"
import { deleteVideoAction } from "../../actions/upsert-video.action"
import { useState } from "react"
import { toast } from "sonner"
import DialogDeleteItem from "@/components/DialogDeleteItem"

type VideoCardProps = {
  video: VideoType | null
}

export function VideoCard({ video }: VideoCardProps) {
  const [isOpenModalDelete, setOpenModalDelete] = useState(false)

  const handleOpenModalDelete = () => {
    setOpenModalDelete(true)
  }

  const handleConfirmDelete = async () => {
    try {
      if (!video) {
        return console.log("Vídeo não encontrado")
      }
      const success = await deleteVideoAction(video.id)

      if (success) {
        setOpenModalDelete(false)
        toast.success("Paciente deletado com sucesso!")
      } else {
        toast.error("Ocorreu um erro ao deletar o paciente.")
        setOpenModalDelete(false)
      }
    } catch (error) {
      console.error("Erro ao deletar o paciente:", error)
      setOpenModalDelete(false)
    }
  }

  return (
    <article className="group bg-background overflow-hidden rounded-xl border transition hover:shadow-md">
      <Link href={`/videos/${video?.id}`}>
        <div className="aspect relative h-60 w-full overflow-hidden bg-(--color-cream)">
          <Image
            src={video?.thumbnailUrl || "/logo.svg"}
            alt={video?.name || "Capa do Video Treino"}
            fill
            className="object-contain p-2 transition duration-300 group-hover:scale-105"
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
              <VideoIcon className="mr-2 size-4" />
              Abrir
            </Link>
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
    </article>
  )
}
