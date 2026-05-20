"use client"

import { ClinicDTO } from "@/dtos/clinic.dto"
import ContactSettings from "../ContactSettings"
import ProfileSettings from "../ProfileSettings"
import AddressSettings from "../AddressSettings"

type ClinicFormProps = {
  clinic: ClinicDTO
}

const ClinicForm = ({ clinic }: ClinicFormProps) => {
  return (
    <section className="flex w-full flex-col items-center gap-6 p-4 lg:p-8">
      {/* --- CARD 1: CONTATO --- */}
      <ContactSettings clinic={clinic} />

      {/* --- CARD 2: PERFIL & REDES SOCIAIS --- */}
      <ProfileSettings clinic={clinic} />

      {/* --- CARD 3: ENDEREÇO --- */}
      <AddressSettings clinic={clinic} />
    </section>
  )
}

export default ClinicForm
