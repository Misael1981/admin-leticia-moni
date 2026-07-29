"use client"

import { EvolutionFormValues } from "@/schemas/patients-schemas"
import { useFormContext } from "react-hook-form"

const SessionWorkoutSelector = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<EvolutionFormValues>()

  return (
    <div className="flex min-h-20 w-full items-center justify-center border p-4">
      <div className="space-y-2 text-center">
        <h3 className="font-heading text-foreground text-xl">
          Aqui o seletor de exercício (vídeos)
        </h3>

        <p>
          Preciso que me passe se acha necessário enviar mais alguma informação,
          tipo os espaçamento de tempo entre um exercício e outro, o tempo que o
          paciente ( minutos ) que cada exercício deve durar.
        </p>
        <p>
          Assim que vc criar a sessão, os exercícios serão atualizados no app do
          paciente e o celular receberá uma notificação, tipo quando chega msn
          do whats...
        </p>
      </div>
    </div>
  )
}

export default SessionWorkoutSelector
