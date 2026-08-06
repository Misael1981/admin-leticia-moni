"use client"

import { ImageUp, X, FileText } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { UseFormReturn, FieldValues, Path, PathValue } from "react-hook-form"

interface MultiImageUploadProps<TFormValues extends FieldValues> {
  form: UseFormReturn<TFormValues>
  name: Path<TFormValues>
  initialUrls?: string[]
}

interface PreviewItem {
  id: string
  url: string
  file?: File
}

const MultiImageUpload = <TFormValues extends FieldValues>({
  form,
  name,
  initialUrls = [],
}: MultiImageUploadProps<TFormValues>) => {
  const [previews, setPreviews] = useState<PreviewItem[]>(() => {
    return initialUrls.map((url, index) => ({
      id: `initial-${index}-${url}`,
      url,
    }))
  })

  // Helper para sincronizar com o React Hook Form
  const syncWithForm = (updatedPreviews: PreviewItem[]) => {
    const filesOrUrls = updatedPreviews.map((p) => p.file || p.url)
    form.setValue(
      name,
      filesOrUrls as unknown as PathValue<TFormValues, Path<TFormValues>>,
      { shouldDirty: true, shouldValidate: true },
    )
  }

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const filesArray = Array.from(files)
      const newPreviews = filesArray.map((file) => ({
        id: crypto.randomUUID(),
        url: URL.createObjectURL(file),
        file,
      }))

      const updated = [...previews, ...newPreviews]
      setPreviews(updated)
      syncWithForm(updated)

      e.target.value = "" // Permite re-selecionar o mesmo arquivo se necessário
    }
  }

  const handleRemoveImage = (
    idToRemove: string,
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault()
    setPreviews((prev) => {
      const item = prev.find((p) => p.id === idToRemove)
      if (item?.url.startsWith("blob:")) {
        URL.revokeObjectURL(item.url)
      }
      const updated = prev.filter((p) => p.id !== idToRemove)
      syncWithForm(updated)
      return updated
    })
  }

  const inputId = `file-upload-${name}`

  return (
    <div className="w-full space-y-4">
      <input
        type="file"
        accept="image/*,application/pdf"
        id={inputId}
        className="hidden"
        multiple
        onChange={handleImagesChange}
      />

      <label
        htmlFor={inputId}
        className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-6 transition hover:bg-slate-50"
      >
        <ImageUp className="text-muted-foreground mb-2 h-8 w-8" />
        <span className="text-sm font-medium text-slate-700">
          Clique para anexar imagens ou laudos dos exames
        </span>
        <span className="text-xs text-slate-400">(PNG, JPG, WEBP ou PDF)</span>
      </label>

      {previews.length > 0 && (
        <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-3 md:grid-cols-4">
          {previews.map((preview) => {
            const isPdf =
              preview.file?.type === "application/pdf" ||
              preview.url.endsWith(".pdf")

            return (
              <div
                key={preview.id}
                className="group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg border bg-white shadow-sm"
              >
                {isPdf ? (
                  <div className="flex flex-col items-center gap-1 p-2 text-center">
                    <FileText className="h-8 w-8 text-blue-500" />
                    <span className="max-w-25 truncate text-xs font-medium text-slate-600">
                      {preview.file?.name || "Documento PDF"}
                    </span>
                  </div>
                ) : (
                  <Image
                    src={preview.url}
                    alt="Preview do Exame"
                    fill
                    className="object-cover"
                  />
                )}

                <button
                  type="button"
                  onClick={(e) => handleRemoveImage(preview.id, e)}
                  className="absolute top-1.5 right-1.5 rounded-full bg-red-500 p-1 text-white shadow transition hover:bg-red-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MultiImageUpload
