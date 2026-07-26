import { db } from "@/lib/prisma"
import { Prisma } from "@misael1981/physio-database"

const videoSelect = {
  id: true,
  name: true,
  createdAt: true,
  updatedAt: true,
  category: true,
  description: true,
  url: true,
  cloudinaryPublicId: true,
  thumbnailUrl: true,
  durationSeconds: true,
} satisfies Prisma.VideoSelect

export type VideoType = Prisma.VideoGetPayload<{
  select: typeof videoSelect
}>

export async function getAllVideos() {
  try {
    const videos = await db.video.findMany({
      select: videoSelect,
      orderBy: {
        name: "asc",
      },
    })

    return videos
  } catch (error) {
    console.error("Erro ao buscar os vídeos treinos:", error)
    return null
  }
}
