"use client"

import { createPatientAccessAction } from "@/app/action/update-patient"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { PatientAuthType, PatientDetail } from "@/data/patients.queries"
import { maskCPF } from "@/helpers/personal-documents"
import {
  PatientAccessInput,
  patientAccessSchema,
  PatientAccessValues,
} from "@/schemas/patients-schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

type PatientAccessFormProps = {
  patient: PatientDetail
  patientAuth: PatientAuthType | null
}

const PatientAccessForm = ({
  patient,
  patientAuth,
}: PatientAccessFormProps) => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const hasCpf = Boolean(patient.cpf)
  const editPin = Boolean(patientAuth?.pinHash)

  const methods = useForm<PatientAccessInput, unknown, PatientAccessValues>({
    resolver: zodResolver(patientAccessSchema),
    defaultValues: {
      pin: "",
    },
  })

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = methods

  const onSubmit = async (data: PatientAccessValues) => {
    if (!hasCpf) return

    startTransition(async () => {
      try {
        const result = await createPatientAccessAction({
          patientId: patient.id,
          pin: data.pin,
        })

        if (result?.error) {
          toast.error(result.error)
          return
        }

        toast.success(
          editPin
            ? "PIN atualizado com sucesso!"
            : "Acesso criado com sucesso!",
        )
        router.push(`/dashboard/pacientes/${patient.id}`)
      } catch (error) {
        console.error("Erro ao criar acesso do paciente ao App:", error)
        toast.error(
          editPin
            ? "Não foi possível editar o acesso. Tente novamente."
            : "Não foi possível criar o acesso. Tente novamente.",
        )
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{patient.name}</CardTitle>
        <CardDescription>
          <strong>CPF do Paciente: </strong>
          {hasCpf
            ? maskCPF(patient.cpf!)
            : "CPF não informado, validar cadastro"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel>
                {editPin ? "Novo PIN de Acesso" : "PIN de Acesso"}
              </FieldLabel>
              <Input
                placeholder={
                  editPin ? "Digite o novo PIN..." : "Apenas números..."
                }
                inputMode="numeric"
                maxLength={6}
                autoComplete="one-time-code"
                disabled={!hasCpf}
                {...register("pin")}
              />
              <FieldError>{errors.pin?.message}</FieldError>
            </Field>
          </FieldGroup>

          {!hasCpf && (
            <p className="text-destructive mt-2 text-sm">
              Complete o CPF no cadastro do paciente antes de liberar o acesso.
            </p>
          )}
        </CardContent>

        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={!hasCpf || isPending}>
            {isPending
              ? "Salvando..."
              : editPin
                ? "Editar Acesso"
                : "Criar Acesso"}
          </Button>
        </CardFooter>
      </form>

      {editPin && patientAuth && (
        <div className="text-muted-foreground space-y-1 rounded-md border p-3 text-sm">
          {patientAuth.lastLoginAt && (
            <p>
              Último acesso:{" "}
              {new Date(patientAuth.lastLoginAt).toLocaleDateString("pt-BR")}
            </p>
          )}
          {patientAuth.lockedUntil && patientAuth.lockedUntil > new Date() && (
            <p className="text-destructive">
              Conta bloqueada até{" "}
              {patientAuth.lockedUntil.toLocaleTimeString("pt-BR")}
            </p>
          )}
        </div>
      )}
    </Card>
  )
}

export default PatientAccessForm
