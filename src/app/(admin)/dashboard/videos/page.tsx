import AddNewButton from "@/components/AddNewButton"
import EmptyData from "@/components/EmptyData"
import PageHeader from "@/components/PageHeader"
import VideoGrid from "@/modules/videos/components/VideoGrid"
import { getAllVideos } from "@/modules/videos/queries/get-videos.queries"
import { Plus, VideoIcon } from "lucide-react"

export default async function VideosPage() {
  const videos = await getAllVideos()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vídeos de Treinos"
        description="Gerencie os vídeos que serão enviados para o app dos pacientes."
      />

      <AddNewButton
        icon={Plus}
        url="/dashboard/videos/new"
        label="Postar Novo Treino"
      />

      {videos && videos.length > 0 && <VideoGrid videos={videos} />}

      {videos?.length === 0 && (
        <EmptyData
          icon={VideoIcon}
          title="Nenhum Vídeo Treino Postado"
          description="Cadastre vídeos para enviar à seus pacientes."
        />
      )}
    </div>
  )
}
