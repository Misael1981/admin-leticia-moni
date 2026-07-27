"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import DrawerContentVideo from "../DrawerContentVideo"

type VideoPlayerProps = {
  src: string
  poster?: string | null
  videoTitle: string
  videoDescription: string | null
  videoDate: Date
}

export function VideoPlayer({
  src,
  poster,
  videoDate,
  videoDescription,
  videoTitle,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [isOpenDeawer, setOpenDrawer] = useState(false)

  useEffect(() => {
    const videoEl = videoRef.current
    if (!videoEl) return

    videoEl
      .play()
      .then(() => {
        setIsPlaying(true)
        resetControlsTimeout()
      })
      .catch(() => {
        videoEl.muted = true
        videoEl.play().then(() => {
          setIsPlaying(true)
          resetControlsTimeout()
        })
      })
  }, [])

  const handleOpenDrawer = () => {
    setOpenDrawer(true)
  }

  function togglePlay() {
    const videoEl = videoRef.current
    if (!videoEl) return

    if (videoEl.paused) {
      videoEl.play()
      setIsPlaying(true)
    } else {
      videoEl.pause()
      setIsPlaying(false)
    }
  }

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const videoEl = videoRef.current
    if (!videoEl) return

    const newTime = Number(e.target.value)
    videoEl.currentTime = newTime
    setCurrentTime(newTime)
  }

  function handleTimeUpdate() {
    const videoEl = videoRef.current
    if (!videoEl) return
    setCurrentTime(videoEl.currentTime)
  }

  function handleLoadedMetadata() {
    const videoEl = videoRef.current
    if (!videoEl) return
    setDuration(videoEl.duration)
    setIsLoading(false)
  }

  function resetControlsTimeout() {
    setShowControls(true)
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)

    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false)
    }, 2500)
  }

  return (
    <div
      className="group relative aspect-9/16 w-full overflow-hidden rounded-md bg-black"
      onMouseMove={resetControlsTimeout}
      onClick={resetControlsTimeout}
    >
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        </div>
      )}

      <video
        ref={videoRef}
        src={src}
        poster={poster ?? undefined}
        className="h-full w-full object-cover"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => {
          setIsPlaying(true)
          resetControlsTimeout()
        }}
        onPause={() => setIsPlaying(false)}
        playsInline
      />

      {/* Overlay de controles */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-linear-to-t from-black/80 to-transparent p-3 transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0",
        )}
      >
        <div className="space-y-1 text-white">
          <h2 className="text-lg font-semibold">{videoTitle}</h2>
          <p className="text-xs">
            {new Date(videoDate).toLocaleDateString("pt-BR")}
          </p>
          {videoDescription && (
            <div className="flex items-center gap-1">
              <p className="min-w-0 flex-1 truncate text-sm">
                {videoDescription}
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto shrink-0 px-1 text-xs"
                onClick={handleOpenDrawer}
              >
                ... Mais
              </Button>
            </div>
          )}
        </div>
        {/* Barra de progresso */}
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="h-1 w-full cursor-pointer accent-white"
        />
      </div>

      <DrawerContentVideo
        videoDate={videoDate}
        videoDescription={videoDescription}
        videoTitle={videoTitle}
        isOpen={isOpenDeawer}
        onClose={() => setOpenDrawer(false)}
      />
    </div>
  )
}
