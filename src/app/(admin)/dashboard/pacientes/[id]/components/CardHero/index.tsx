"use client"

import GetStatusBadge from "@/components/GetStatusBadge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BIOLOGICAL_SEX_LABELS } from "@/constants/labels"
import { PatientDetail } from "@/data/patients.queries"
import { formatBirthDate, getPatientAge } from "@/helpers/format-birth-date"
import { formatPhoneNumber } from "@/helpers/format-phone-number"
import { initialsName } from "@/helpers/initials-name"
import { MessageCircle, Pencil, PlusCircle } from "lucide-react"
import Link from "next/link"

type CardHeroProps = {
  patient: PatientDetail
}

const CardHero = ({ patient }: CardHeroProps) => {
  return (
    <Card className="gap-2 p-4">
      <div className="flex flex-col-reverse justify-center gap-4 lg:flex-row lg:justify-between">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 border">
            <AvatarImage
              src={patient.avatarUrl ?? undefined}
              alt={patient.name}
            />
            <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
              {initialsName(patient.name)}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1">
            <h1 className="text-foreground text-2xl font-bold tracking-tight">
              {patient.name}
            </h1>

            {patient.nickname && (
              <div className="text-muted-foreground text-sm">
                <span>Apelido: {patient.nickname}</span>
              </div>
            )}

            <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              {/* Exemplo de exibição de dados */}
              {patient.birthDate && (
                <>
                  <span>{getPatientAge(patient.birthDate)} anos</span>
                  <span>•</span>
                  <span>{formatBirthDate(patient.birthDate)}</span>
                </>
              )}

              {patient.biologicalSex && (
                <>
                  <span>•</span>
                  <span>{BIOLOGICAL_SEX_LABELS[patient.biologicalSex]}</span>
                </>
              )}
            </div>

            {patient.phone && (
              <div className="text-muted-foreground text-sm">
                <span>📱 {formatPhoneNumber(patient.phone)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">{GetStatusBadge(patient.status)}</div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t pt-4 lg:justify-end">
        <Link
          href={`https://wa.me/${patient.phone?.replace(/\D/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`gap-2 ${buttonVariants({ variant: "outline" })} border-emerald-200 text-emerald-600 hover:text-emerald-400`}
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </Link>

        <Link
          href={`/dashboard/pacientes/${patient.id}/editar-cadastro`}
          className={buttonVariants({ variant: "outline" })}
        >
          <Pencil className="h-4 w-4" />
          Editar Cadastro
        </Link>

        <Link
          href={`/dashboard/pacientes/${patient.id}?tab=evolutions`}
          className={buttonVariants({ variant: "default" })}
        >
          <PlusCircle className="h-4 w-4" />
          Nova Evolução
        </Link>
      </div>
    </Card>
  )
}

export default CardHero
