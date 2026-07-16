"use client"

import { ClinicDTO } from "@/dtos/clinic.dto"
import ContactSettings from "../ContactSettings"
import ProfileSettings from "../ProfileSettings"
import AddressSettings from "../AddressSettings"
import OpeningHours from "../OpeningHours"

type ClinicFormProps = {
  clinic: ClinicDTO
}

const ClinicForm = ({ clinic }: ClinicFormProps) => {
  return (
    <section className="w-full space-y-6 p-4 lg:p-8">
      <div className="flex w-full flex-col items-center gap-6">
        {/* --- CARD 1: CONTATO --- */}
        <ContactSettings clinic={clinic} />
        {/* --- CARD 2: PERFIL & REDES SOCIAIS --- */}
        <ProfileSettings clinic={clinic} />
        {/* --- CARD 3: ENDEREÇO --- */}
        <AddressSettings clinic={clinic} />
        {/* --- CARD 3: HORÁRIO --- */}
        <OpeningHours openingHours={clinic.businessHours} />
      </div>
    </section>
  )
}

export default ClinicForm
