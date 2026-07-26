"use server"

import { db } from "@/lib/prisma"
import { videoSchema, VideoFormValues } from "../schemas/video-schema"
import { revalidatePath } from "next/cache"
import cloudinary from "@/lib/cloudinary"

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

export async function deleteVideoAction(videoId: string) {
  try {
    const video = await db.video.findUnique({
      where: { id: videoId },
    })

    if (!video) {
      return { success: false, error: "Vídeo não encontrado." }
    }

    if (video.cloudinaryPublicId) {
      await cloudinary.uploader.destroy(video.cloudinaryPublicId, {
        resource_type: "video",
      })
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
