import PageHeader from "@/components/PageHeader"

export default function DashboardPage() {
  return (
    <div className="w-full space-x-6">
      <PageHeader
        title="Visão Geral"
        description="Resumo de pacientes, tratamentos e uma visão geral do seu estabelecimento."
      />
    </div>
  )
}
