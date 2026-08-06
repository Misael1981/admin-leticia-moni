import imageCompression from "browser-image-compression"

export const uploadToCloudinaryClient = async (file: File) => {
  const options = {
    maxSizeMB: 0.7,
    maxWidthOrHeight: 1080,
    useWebWorker: true,
  }

  try {
    const compressedFile = await imageCompression(file, options)

    const formData = new FormData()
    formData.append("file", compressedFile)
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
    )

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    )

    const data = await response.json()
    return {
      url: data.secure_url,
      publicId: data.public_id,
    }
  } catch (error) {
    console.error("Erro na compressão ou upload:", error)
    throw error
  }
}

export interface UploadedMediaResult {
  urls: string[]
  publicIds: string[]
}

export const uploadMultipleImages = async (
  items: (File | string)[],
  existingPublicIds: string[] = [],
): Promise<UploadedMediaResult> => {
  try {
    // 1. O que já é URL antiga que veio do banco
    const existingUrls = items.filter(
      (item): item is string => typeof item === "string",
    )

    // 2. Os novos arquivos que precisam de upload
    const newFiles = items.filter((item): item is File => item instanceof File)

    // 3. Faz o upload em paralelo dos novos arquivos
    const uploadPromises = newFiles.map((file) =>
      uploadToCloudinaryClient(file),
    )
    const uploadedImagesResults = await Promise.all(uploadPromises)

    // 4. Extrai as novas URLs e os novos Public IDs
    const newUrls = uploadedImagesResults.map((img) => img.url)
    const newPublicIds = uploadedImagesResults.map((img) => img.publicId)

    return {
      urls: [...existingUrls, ...newUrls],
      // Mantém os publicIds existentes (se passados) + os novos gerados
      publicIds: [...existingPublicIds, ...newPublicIds],
    }
  } catch (error) {
    console.error("Erro no upload em lote das imagens do exame:", error)
    throw new Error("Falha ao processar e enviar as imagens dos exames.")
  }
}
