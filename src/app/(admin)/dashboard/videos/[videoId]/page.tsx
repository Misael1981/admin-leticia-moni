import PageHeader from "@/components/PageHeader"
import VideoForm from "@/modules/videos/components/VideoForm"
import { getVideoById } from "@/modules/videos/queries/get-videos.queries"
import { notFound } from "next/navigation"

interface VideoEditingPageProps {
  params: Promise<{ videoId: string }>
}

export default async function VideoEditingPage({
  params,
}: VideoEditingPageProps) {
  const { videoId } = await params

  const video = await getVideoById(videoId)

  if (!video) {
    notFound() // Redireciona para a página 404 automaticamente
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Edite o conteúdo do Vídeo" />

      <div className="flex justify-center">
        <VideoForm initialData={video} />
      </div>
    </div>
  )
}
