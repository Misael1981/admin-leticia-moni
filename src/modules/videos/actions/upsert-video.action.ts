"use server"

import { db } from "@/lib/prisma"
import { videoSchema, VideoFormValues } from "../schemas/video-schema"
import { revalidatePath } from "next/cache"

// Tipagem do retorno da Server Action
type UpsertVideoResponse = {
  success: boolean
  message: string
  videoId?: string
  error?: string
}

export async function upsertVideoAction(
  data: VideoFormValues,
  videoId?: string,
): Promise<UpsertVideoResponse> {
  try {
    const validatedFields = videoSchema.parse(data)

    const videoData = {
      name: validatedFields.name,
      description: validatedFields.description,
      category: validatedFields.category,
      url: validatedFields.url,
      cloudinaryPublicId: validatedFields.cloudinaryPublicId,
      thumbnailUrl: validatedFields.thumbnailUrl,
      durationSeconds: validatedFields.durationSeconds,
    }

    if (videoId) {
      const existingVideo = await db.video.findUnique({
        where: { id: videoId },
      })

      if (!existingVideo) {
        return {
          success: false,
          message: "Vídeo não encontrado para atualização.",
          error: "Vídeo não encontrado para atualização.",
        }
      }

      const updatedVideo = await db.video.update({
        where: { id: videoId },
        data: videoData,
      })

      revalidatePath("/dashboard/videos")
      revalidatePath(`/dashboard/videos/${videoId}`)

      return {
        success: true,
        message: "Vídeo treino atualizado com sucesso!",
        videoId: updatedVideo.id,
      }
    }

    const newVideo = await db.video.create({
      data: videoData,
    })

    revalidatePath("/dashboard/videos")

    return {
      success: true,
      message: "Vídeo treino cadastrado com sucesso!",
      videoId: newVideo.id,
    }
  } catch (error) {
    console.error("❌ Erro ao salvar vídeo treino:", error)
    return {
      success: false,
      message:
        "Falha ao salvar o vídeo treino. Verifique os dados e tente novamente.",
      error:
        "Falha ao salvar o vídeo treino. Verifique os dados e tente novamente.",
    }
  }
}
