export const uploadVideoToCloudinaryClient = async (file: File) => {
  try {
    const formData = new FormData()
    formData.append("file", file)
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
    )

    // Note a palavra /video/upload em vez de /image/upload
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`,
      {
        method: "POST",
        body: formData,
      },
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(
        data.error?.message || "Erro ao subir vídeo no Cloudinary",
      )
    }

    return {
      url: data.secure_url as string,
      publicId: data.public_id as string,
      duration: data.duration as number, // O Cloudinary devolve a duração exata!
    }
  } catch (error) {
    console.error("Erro no upload do vídeo:", error)
    throw error
  }
}
