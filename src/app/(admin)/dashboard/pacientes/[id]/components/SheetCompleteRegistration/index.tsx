"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import {
  BIOLOGICAL_SEX_LABELS,
  EDUCATION_LEVEL_LABELS,
  MARITAL_STATUS_LABELS,
  PATIENT_REFERRAL_SOURCE_LABEL,
} from "@/constants/labels"
import { PatientDetail } from "@/data/patients.queries"
import { formatBirthDate, getPatientAge } from "@/helpers/format-birth-date"
import { formatPhoneNumber } from "@/helpers/format-phone-number"
import { initialsName } from "@/helpers/initials-name"

// TODO: mover para @/constants/labels se já existir algo parecido lá

type SheetCompleteRegistrationProps = {
  patient: PatientDetail
  isOpen: boolean
  onClose: () => void
}

type InfoItemProps = {
  label: string
  value?: string | null
}

const InfoItem = ({ label, value }: InfoItemProps) => {
  if (!value) return null

  return (
    <div className="space-y-0.5">
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="text-foreground text-sm font-medium">{value}</p>
    </div>
  )
}

type SectionProps = {
  title: string
  children: React.ReactNode
}

const Section = ({ title, children }: SectionProps) => (
  <div className="space-y-3">
    <h3 className="text-foreground text-sm font-semibold">{title}</h3>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
  </div>
)

const SheetCompleteRegistration = ({
  patient,
  isOpen,
  onClose,
}: SheetCompleteRegistrationProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 border">
              <AvatarImage
                src={patient.avatarUrl ?? undefined}
                alt={patient.name}
              />
              <AvatarFallback className="bg-primary/10 text-primary text-base font-semibold">
                {initialsName(patient.name)}
              </AvatarFallback>
            </Avatar>

            <div>
              <SheetTitle>{patient.name}</SheetTitle>
              <SheetDescription>Ficha de cadastro completa</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-6 px-4 py-6">
          <Section title="Dados pessoais">
            <InfoItem label="Apelido" value={patient.nickname} />
            <InfoItem
              label="Idade"
              value={
                patient.birthDate
                  ? `${getPatientAge(patient.birthDate)} anos`
                  : null
              }
            />
            <InfoItem
              label="Data de nascimento"
              value={
                patient.birthDate ? formatBirthDate(patient.birthDate) : null
              }
            />
            <InfoItem
              label="Sexo biológico"
              value={
                patient.biologicalSex
                  ? BIOLOGICAL_SEX_LABELS[patient.biologicalSex]
                  : null
              }
            />
            <InfoItem label="Gênero" value={patient.gender} />
            <InfoItem
              label="Estado civil"
              value={
                patient.maritalStatus
                  ? MARITAL_STATUS_LABELS[patient.maritalStatus]
                  : null
              }
            />
            <InfoItem
              label="Escolaridade"
              value={
                patient.education
                  ? EDUCATION_LEVEL_LABELS[patient.education]
                  : null
              }
            />
            <InfoItem label="Profissão" value={patient.profession} />
            <InfoItem label="Naturalidade" value={patient.birthCity} />
            <InfoItem label="Estado natal" value={patient.birthState} />
            <InfoItem label="Nacionalidade" value={patient.nationality} />
          </Section>

          <Separator />

          <Section title="Documentos">
            <InfoItem label="CPF" value={patient.cpf} />
            <InfoItem label="RG" value={patient.rg} />
          </Section>

          <Separator />

          <section className="space-y-3">
            <InfoItem
              label="Telefone"
              value={patient.phone ? formatPhoneNumber(patient.phone) : null}
            />
            <InfoItem label="E-mail" value={patient.email} />
          </section>

          {patient.address && (
            <>
              <Separator />
              <Section title="Endereço">
                <InfoItem label="Logradouro" value={patient.address.street} />
                <InfoItem label="Número" value={patient.address.number} />
                <InfoItem
                  label="Complemento"
                  value={patient.address.complement}
                />
                <InfoItem label="Bairro" value={patient.address.district} />
                <InfoItem label="Cidade" value={patient.address.city} />
                <InfoItem label="Estado" value={patient.address.state} />
                <InfoItem label="CEP" value={patient.address.zipCode} />
              </Section>
            </>
          )}

          {(patient.emergencyContactName || patient.emergencyContactPhone) && (
            <>
              <Separator />
              <Section title="Contato de emergência">
                <InfoItem label="Nome" value={patient.emergencyContactName} />
                <InfoItem
                  label="Telefone"
                  value={
                    patient.emergencyContactPhone
                      ? formatPhoneNumber(patient.emergencyContactPhone)
                      : null
                  }
                />
              </Section>
            </>
          )}

          <Separator />

          <Section title="Convênio">
            <div className="col-span-2">
              <Badge variant={patient.hasInsurance ? "default" : "secondary"}>
                {patient.hasInsurance ? "Possui convênio" : "Sem convênio"}
              </Badge>
            </div>
            {patient.hasInsurance && (
              <>
                <InfoItem
                  label="Nome do convênio"
                  value={patient.insuranceName}
                />
                <InfoItem
                  label="Número da carteirinha"
                  value={patient.insuranceNumber}
                />
              </>
            )}
          </Section>

          <Separator />

          <Section title="Outras informações">
            <InfoItem
              label="Como conheceu a clínica"
              value={
                patient.patientSource
                  ? PATIENT_REFERRAL_SOURCE_LABEL[patient.patientSource]
                  : null
              }
            />
            <InfoItem
              label="Profissional indicado"
              value={patient.referralProfessional}
            />
          </Section>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default SheetCompleteRegistration
