import PageHeader from "@/components/PageHeader"

interface MedicalRecordProps {
  params: Promise<{
    id: string
  }>
}

export default async function MedicalRecordPage({
  params,
}: MedicalRecordProps) {
  const id = await params

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gerenciamento do Prontuário"
        description="Consulte todo o histórico clínico do paciente em um único lugar. Registre evoluções, tratamentos, avaliações, observações e acompanhe a evolução do atendimento de forma organizada, garantindo um acompanhamento completo durante todo o processo de reabilitação"
      />
    </div>
  )
}
