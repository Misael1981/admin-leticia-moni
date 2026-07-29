"use client"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { VideoType } from "@/modules/videos/queries/get-videos.queries"
import VideoSelectorCard from "../VideoSelectorCard"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import SearchVideo from "../SearchVideo"

type DialogWorkoutListProps = {
  videos?: VideoType[] | null
  isOpen: boolean
  onClose: () => void
  initialSelectedIds?: string[]
  onConfirm: (selectedIds: string[]) => void
}

const DialogWorkoutList = ({
  videos,
  isOpen,
  onClose,
  initialSelectedIds = [],
  onConfirm,
}: DialogWorkoutListProps) => {
  const [selectedVideos, setSelectedVideos] =
    useState<string[]>(initialSelectedIds)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredVideos = useMemo(() => {
    const list = videos ?? []

    if (!searchTerm.trim()) return list

    return list.filter((video) =>
      video.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [videos, searchTerm])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex max-h-[85vh] max-w-4xl flex-col">
        <DialogHeader>
          <DialogTitle>Biblioteca de Exercícios</DialogTitle>
        </DialogHeader>

        {/* Input de Busca */}
        <div className="pt-2 pb-4">
          <SearchVideo value={searchTerm} onChange={setSearchTerm} />
        </div>

        {/* Grid com Scroll Interno */}
        <div className="flex-1 overflow-y-auto pr-1">
          {filteredVideos.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredVideos.map((video) => (
                <VideoSelectorCard
                  key={video.id}
                  video={video}
                  checked={selectedVideos.includes(video.id)}
                  onCheckedChange={(checked) => {
                    setSelectedVideos((prev) => {
                      if (checked) {
                        return prev.includes(video.id)
                          ? prev
                          : [...prev, video.id]
                      }
                      return prev.filter((id) => id !== video.id)
                    })
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground text-sm font-medium">
                Nenhum treino encontrado para {searchTerm}.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="border-t pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={() => onConfirm(selectedVideos)}>
            Vincular vídeos ({selectedVideos.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DialogWorkoutList
