"use client"

import { ImageUp, X } from "lucide-react"
import { useState } from "react"
import { UseFormReturn, FieldValues, Path, PathValue } from "react-hook-form"

type ImageUploadForm<TFormValues extends FieldValues> = Pick<
  UseFormReturn<TFormValues>,
  "setValue"
>

interface ImageUploadProps<TFormValues extends FieldValues> {
  form: ImageUploadForm<TFormValues>
  name: Path<TFormValues>
  initialUrl?: string | File | null
}

// Deriva a URL de preview a partir do valor inicial, que pode ser:
// - uma string vazia (nenhuma imagem ainda) -> null
// - uma URL já existente (edição) -> ela mesma
// - um File pendente de upload (form ainda não submetido) -> object URL
const resolveInitialPreview = (
  value: string | File | null | undefined,
): string | null => {
  if (!value) return null
  if (value instanceof File) return URL.createObjectURL(value)
  return value
}

const ImageUpload = <TFormValues extends FieldValues>({
  form,
  name,
  initialUrl = null,
}: ImageUploadProps<TFormValues>) => {
  const [preview, setPreview] = useState<string | null>(() =>
    resolveInitialPreview(initialUrl),
  )

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file) {
      const previewURL = URL.createObjectURL(file)
      setPreview(previewURL)

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

  const handleRemoveImage = (e: React.MouseEvent<HTMLButtonElement>) => {
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
  }

  const inputId = `file-upload-${name}`

  return (
    <div>
      <div className="relative w-full rounded-xl bg-slate-200">
        <input
          type="file"
          accept="image/*"
          id={inputId}
          className="hidden py-4"
          onChange={handleLogoChange}
        />

        <label
          htmlFor={inputId}
          className="hover:bg-accent flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-6 py-10 transition"
        >
          {preview ? (
            <div className="relative flex min-h-40 items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Preview"
                width={128}
                height={128}
                className="max-h-40 w-auto object-contain"
              />
            </div>
          ) : (
            <>
              <ImageUp className="text-muted-foreground mb-3 h-10 w-10" />
              <span className="text-muted-foreground text-sm">
                Clique para enviar a imagem
              </span>
            </>
          )}
        </label>

        {preview && (
          <button
            type="button"
            onClick={handleRemoveImage}
            className="bg-background/80 absolute top-0 right-0 rounded-full px-1 py-2 shadow"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export default ImageUpload
