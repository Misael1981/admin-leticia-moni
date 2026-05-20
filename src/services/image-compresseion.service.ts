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
