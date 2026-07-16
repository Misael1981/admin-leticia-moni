import PageHeader from "@/components/PageHeader"
import { getClinicSettings } from "@/data/get-clinic-settings"
import ClinicForm from "./components/ClinicForm"

export default async function InfoClinicPage() {
  const dataClinic = await getClinicSettings()

  return (
    <>
      <PageHeader
        title="Dados Primários da Clínica"
        description="Esses dados/imagens serão a base do que serão mostrados sobre seu estabelecimento na página/app."
      />

      <ClinicForm clinic={dataClinic} />
    </>
  )
}
