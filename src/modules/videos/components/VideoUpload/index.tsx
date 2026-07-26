"use client"

import { Video, X } from "lucide-react"
import { useState, useRef } from "react"
import { UseFormReturn, FieldValues, Path, PathValue } from "react-hook-form"

type VideoUploadForm<TFormValues extends FieldValues> = Pick<
  UseFormReturn<TFormValues>,
  "setValue"
>

interface VideoUploadProps<TFormValues extends FieldValues> {
  form: VideoUploadForm<TFormValues>
  name: Path<TFormValues>
  durationName?: Path<TFormValues> // Opcional: para salvar durationSeconds automaticamente
  initialUrl?: string | null
}

const VideoUpload = <TFormValues extends FieldValues>({
  form,
  name,
  durationName,
  initialUrl = null,
}: VideoUploadProps<TFormValues>) => {
  const [preview, setPreview] = useState<string | null>(initialUrl)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file) {
      const previewURL = URL.createObjectURL(file)
      setPreview(previewURL)

      // 1. Passa o arquivo File para o React Hook Form
      form.setValue(
        name,
        file as unknown as PathValue<TFormValues, Path<TFormValues>>,
        {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        },
      )
    }
  }

  // 2. Evento disparado quando o vídeo carrega no navegador para pegar a duração
  const handleLoadedMetadata = () => {
    if (videoRef.current && durationName) {
      const durationInSeconds = Math.round(videoRef.current.duration)

      form.setValue(
        durationName,
        durationInSeconds as unknown as PathValue<
          TFormValues,
          Path<TFormValues>
        >,
        {
          shouldDirty: true,
          shouldTouch: true,
        },
      )
    }
  }

  const handleRemoveVideo = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setPreview(null)

    form.setValue(
      name,
      "" as unknown as PathValue<TFormValues, Path<TFormValues>>,
      {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      },
    )

    if (durationName) {
      form.setValue(
        durationName,
        null as unknown as PathValue<TFormValues, Path<TFormValues>>,
      )
    }
  }

  const inputId = `file-upload-${name}`

  return (
    <div>
      <div className="w-full overflow-hidden rounded-xl bg-slate-200">
        <input
          type="file"
          accept="video/*"
          id={inputId}
          className="hidden"
          onChange={handleVideoChange}
        />

        {preview ? (
          <div className="relative flex flex-col items-center justify-center bg-black/5 p-2">
            {/* Tag nativa de vídeo para dar play na prévia */}
            <video
              ref={videoRef}
              src={preview}
              controls
              onLoadedMetadata={handleLoadedMetadata}
              className="max-h-75 w-full rounded-lg bg-black object-contain"
            />

            <button
              type="button"
              onClick={handleRemoveVideo}
              className="bg-background/80 hover:bg-background absolute top-4 right-4 rounded-full p-1.5 shadow transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label
            htmlFor={inputId}
            className="hover:bg-accent flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed p-8 transition"
          >
            <Video className="text-muted-foreground mb-3 h-10 w-10" />
            <span className="text-muted-foreground text-sm font-medium">
              Clique para selecionar o vídeo do exercício
            </span>
            <span className="text-muted-foreground/70 mt-1 text-xs">
              MP4, MOV ou WebM (Sugerido até 1 minuto)
            </span>
          </label>
        )}
      </div>
    </div>
  )
}

export default VideoUpload
