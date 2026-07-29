"use server"

import { db } from "@/lib/prisma"
import { v2 as cloudinary } from "cloudinary"
import { revalidatePath } from "next/cache"

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function deleteVideoAction(videoId: string) {
  try {
    const video = await db.video.findUnique({
      where: { id: videoId },
    })

    if (!video) {
      throw new Error("Vídeo não encontrado no banco de dados.")
    }

    if (video.cloudinaryPublicId) {
      const cloudinaryResult = await cloudinary.uploader.destroy(
        video.cloudinaryPublicId,
        {
          resource_type: "video",
          invalidate: true,
        },
      )

      if (
        cloudinaryResult.result !== "ok" &&
        cloudinaryResult.result !== "not found"
      ) {
        throw new Error(`Erro no Cloudinary: ${cloudinaryResult.result}`)
      }
    }

    await db.video.delete({
      where: { id: videoId },
    })

    revalidatePath("/dashboard/videos")

    return {
      success: true,
      message: "Vídeo excluído com sucesso!",
    }
  } catch (error) {
    console.error("❌ Erro ao deletar vídeo:", error)
    return {
      success: false,
      error: "Falha ao excluir o vídeo. Tente novamente.",
    }
  }
}
