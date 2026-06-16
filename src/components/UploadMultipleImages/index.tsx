"use client"

import { uploadToCloudinaryClient } from "@/services/image-compresseion.service"
import { ImageUp, X, Loader2 } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { FieldValues, Path, PathValue, UseFormReturn } from "react-hook-form"
import { toast } from "sonner"

interface ImageUploadProps<TFormValues extends FieldValues> {
  form: UseFormReturn<TFormValues>
  name: Path<TFormValues>
  initialImages?: { id?: string; url: string }[]
  initialUrl?: string
}

const UploadMultipleImages = <TFormValues extends FieldValues>({
  form,
  name,
  initialImages = [],
  initialUrl,
}: ImageUploadProps<TFormValues>) => {
  const [addedPreviews, setAddedPreviews] = useState<string[]>([])
  const [removedInitialIds, setRemovedInitialIds] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const initialImagesList =
    initialImages && initialImages.length > 0
      ? initialImages
      : initialUrl
        ? [{ url: initialUrl }]
        : []

  const initialItems = initialImagesList.map((img) => ({
    id: img.id ?? img.url,
    url: img.url,
  }))

  const displayedInitialItems = initialItems.filter(
    (item) => !removedInitialIds.includes(item.id),
  )

  const previews = [
    ...displayedInitialItems.map((i) => i.url),
    ...addedPreviews,
  ]

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const result = await uploadToCloudinaryClient(file)
        return result.url

        // Simulando o upload enquanto você não conecta a função:
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return URL.createObjectURL(file)
      })

      const uploadedUrls = await Promise.all(uploadPromises)

      const newAddedPreviews = [...addedPreviews, ...uploadedUrls]
      setAddedPreviews(newAddedPreviews)

      const updatedPreviews = [
        ...displayedInitialItems.map((i) => i.url),
        ...newAddedPreviews,
      ]

      const formValues = updatedPreviews.map((url) => ({ url }))

      form.setValue(
        name,
        formValues as unknown as PathValue<TFormValues, Path<TFormValues>>,
        { shouldDirty: true, shouldTouch: true, shouldValidate: true },
      )

      toast.success(`${files.length} imagem(ns) adicionada(s)!`)
    } catch (error) {
      console.error("Erro no upload:", error)
      toast.error("Falha ao enviar uma ou mais imagens.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = (indexToRemove: number, e: React.MouseEvent) => {
    e.preventDefault()

    const initialCount = displayedInitialItems.length

    if (indexToRemove < initialCount) {
      // remoção em initial items (usa o índice relativo)
      const idToRemove = displayedInitialItems[indexToRemove].id
      const newRemoved = [...removedInitialIds, idToRemove]
      setRemovedInitialIds(newRemoved)

      const updatedPreviews = [
        ...displayedInitialItems
          .filter((item) => item.id !== idToRemove)
          .map((i) => i.url),
        ...addedPreviews,
      ]

      const formValues = updatedPreviews.map((url) => ({ url }))

      form.setValue(
        name,
        formValues as unknown as PathValue<TFormValues, Path<TFormValues>>,
        { shouldDirty: true, shouldTouch: true, shouldValidate: true },
      )
    } else {
      // remoção em added previews
      const addedIndex = indexToRemove - initialCount
      const newAdded = addedPreviews.filter((_, idx) => idx !== addedIndex)
      setAddedPreviews(newAdded)

      const updatedPreviews = [
        ...displayedInitialItems.map((i) => i.url),
        ...newAdded,
      ]

      const formValues = updatedPreviews.map((url) => ({ url }))

      form.setValue(
        name,
        formValues as unknown as PathValue<TFormValues, Path<TFormValues>>,
        { shouldDirty: true, shouldTouch: true, shouldValidate: true },
      )
    }
  }

  const inputId = `file-upload-${name}`

  return (
    <div className="w-full space-y-4">
      {previews.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {previews.map((url, index) => (
            <div
              key={url + index}
              className="group relative aspect-square overflow-hidden rounded-xl border bg-slate-50"
            >
              <Image
                src={url}
                alt={`Preview ${index + 1}`}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={(e) => handleRemoveImage(index, e)}
                className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white opacity-0 shadow-md transition-all group-hover:opacity-100 hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="w-full">
        <input
          type="file"
          accept="image/*"
          id={inputId}
          className="hidden"
          multiple
          onChange={handleFileChange}
          disabled={isUploading}
        />

        <label
          htmlFor={inputId}
          className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed bg-slate-100/50 p-6 transition hover:bg-slate-50"
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="text-primary h-8 w-8 animate-spin" />
              <span className="text-muted-foreground text-sm">
                Enviando arquivos para a nuvem...
              </span>
            </div>
          ) : (
            <>
              <ImageUp className="text-muted-foreground mb-2 h-8 w-8" />
              <span className="text-muted-foreground text-sm font-medium">
                Clique para adicionar fotos do produto
              </span>
              <span className="text-muted-foreground/70 mt-1 text-xs">
                Você pode selecionar vários arquivos de uma vez
              </span>
            </>
          )}
        </label>
      </div>
    </div>
  )
}

export default UploadMultipleImages
