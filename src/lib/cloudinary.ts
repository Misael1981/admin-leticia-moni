import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

function extractPublicIdFromUrl(url: string): string | null {
  try {
    const parts = url.split("/")
    const uploadIndex = parts.indexOf("upload")

    if (uploadIndex === -1) return null

    const remainingParts = parts.slice(uploadIndex + 2)
    const fileWithExtension = remainingParts.join("/")

    const publicId = fileWithExtension.substring(
      0,
      fileWithExtension.lastIndexOf("."),
    )

    return publicId
  } catch (error) {
    console.error("Erro ao extrair public_id da URL:", url, error)
    return null
  }
}

export async function deleteImagesFromCloudinary(urls: string | string[]) {
  try {
    const urlArray = Array.isArray(urls) ? urls : [urls]

    const publicIds = urlArray
      .map((url) => extractPublicIdFromUrl(url))
      .filter((id): id is string => id !== null)

    if (publicIds.length === 0)
      return { success: true, message: "Nenhuma imagem válida para deletar." }
    const result = await cloudinary.api.delete_resources(publicIds)

    console.log("Imagens deletadas do Cloudinary com sucesso:", result)
    return { success: true, result }
  } catch (error) {
    console.error("Falha ao deletar imagens no Cloudinary:", error)
    return { success: false, error }
  }
}
