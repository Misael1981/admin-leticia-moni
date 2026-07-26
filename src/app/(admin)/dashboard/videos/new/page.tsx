import PageHeader from "@/components/PageHeader"
import VideoForm from "@/modules/videos/components/VideoForm"

export default async function NewVideoPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Postar Novo Vídeo" />

      <div className="flex justify-center">
        <VideoForm />
      </div>
    </div>
  )
}
