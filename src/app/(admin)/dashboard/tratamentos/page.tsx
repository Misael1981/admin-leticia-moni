import PageHeader from "@/components/PageHeader"
import { getTreatments } from "@/data/get-treatments"
import AddTreatmentButton from "./components/AddTreatmentButton"

export default async function TreatmentsPage() {
  const treatments = await getTreatments()

  return (
    <>
      <PageHeader
        title="Gerenciamento dos tratamentos disponíveis"
        description="Gerencie os tratamentos e serviços oferecidos na clínica."
      />
      <div className="space-y-6 p-4 lg:p-8">
        <AddTreatmentButton />
      </div>
      <div>
        {treatments.length === 0 && (
          <div className="p-8">
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center">
              <h3 className="text-lg font-semibold">
                Nenhum tratamento disponível
              </h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Cadastre o primeiro tratamento da clínica para exibir no site.
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
