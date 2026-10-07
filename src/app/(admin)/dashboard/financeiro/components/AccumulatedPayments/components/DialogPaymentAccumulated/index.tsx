"use client"

import { CurrencyInput } from "@/components/CurrencyInput"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { PAYMENT_METHOD_OPTIONS } from "@/constants/options"
import { formatCurrency } from "@/helpers/format-currency"
import { AccumulatedPatientGroup } from "@/helpers/group-accumulated-items"
import { ChargeFormInput, chargeFormSchema } from "@/schemas/payment.schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useTransition } from "react"
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"

type DialogPaymentAccumulatedProps = {
  isOpen: boolean
  onClose: () => void
  group: AccumulatedPatientGroup | null
}

const DialogPaymentAccumulated = ({
  isOpen,
  onClose,
  group,
}: DialogPaymentAccumulatedProps) => {
  const [isPending, startTransition] = useTransition()

  const methods = useForm<ChargeFormInput>({
    resolver: zodResolver(chargeFormSchema),
    defaultValues: {
      discount: undefined,
      paidAmount: undefined,

      paymentMethod: undefined,
      notes: "",
    },
  })

  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { errors },
  } = methods

  const discount = useWatch({ control, name: "discount" })
  const dynamicTotal = (group?.total ?? 0) - Number(discount ?? 0)

  useEffect(() => {
    if (isOpen) {
      reset({
        discount: undefined,
        paidAmount: undefined,
        paymentMethod: undefined,
        notes: "",
      })
    }
  }, [isOpen, group?.patient.id, reset])

  const onSubmit = async (data: ChargeFormInput) => {
    startTransition(async () => {
      try {
        console.log("📦 DADOS DO FORM:", data)
      } catch (error) {
        console.error("Erro ao registrar pagamento:", error)
        toast.error("Ocorreu um erro ao registrar o pagamento.")
      }
    })
  }

  const onError = (errors: unknown) => {
    console.log("❌ O ZOD BLOQUEOU O ENVIO NESSES CAMPOS:", errors)
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent className="max-h-[95vh] overflow-hidden">
        <DialogHeader className="space-y-1">
          <DialogTitle>Fechar fatura mensal</DialogTitle>
          <DialogDescription>
            Confira as consultas acumuladas e registre o pagamento
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted/40 rounded-lg border p-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-muted-foreground text-[10px] font-medium uppercase">
                Paciente
              </p>
              <p className="font-semibold">{group?.patient.name}</p>
            </div>

            <div className="text-right">
              <p className="text-muted-foreground text-[10px] font-medium uppercase">
                Vencimento
              </p>
              <p className="font-semibold">Dia {group?.patient.billingDay}</p>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between border-t pt-2">
            <div>
              <p className="text-muted-foreground text-[10px] font-medium uppercase">
                Valor inicial
              </p>
              <p className="font-semibold">
                {formatCurrency(group?.total ?? 0)}
              </p>
            </div>

            {Number(discount ?? 0) > 0 && (
              <div className="text-right">
                <p className="text-muted-foreground text-[10px] font-medium uppercase">
                  Desconto
                </p>
                <p className="text-sm text-rose-600">
                  - {formatCurrency(Number(discount))}
                </p>
              </div>
            )}

            <div className="text-right">
              <p className="text-muted-foreground text-[10px] font-medium uppercase">
                Total
              </p>
              <p className="text-lg font-bold text-green-600">
                {formatCurrency(dynamicTotal)}
              </p>
            </div>
          </div>

          <div className="mt-3 border-t pt-2">
            <p className="text-muted-foreground mb-1 text-[10px] font-medium uppercase">
              Consultas
            </p>

            <p className="text-sm">
              {group?.items.map((item, index) => (
                <span key={item.id}>
                  {new Date(item.evolution.sessionDate).toLocaleDateString(
                    "pt-BR",
                  )}
                  {index < group.items.length - 1 && ", "}
                </span>
              ))}
            </p>
          </div>
        </div>

        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit, onError)}
            className="custom-scroll max-h-[calc(95vh-315px)] space-y-4 overflow-y-auto pr-1"
          >
            <FieldGroup className="pb-4">
              <div className="flex gap-4">
                <CurrencyInput name="discount" label="Desconto" />
                <CurrencyInput name="paidAmount" label="Pagamento Parcial" />
              </div>

              <div className="flex flex-col gap-4 md:flex-row">
                <Field className="w-full max-w-lg">
                  <FieldLabel>Modo de Pagamento</FieldLabel>
                  <Controller
                    name="paymentMethod"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value ?? ""}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione o método" />
                        </SelectTrigger>
                        <SelectContent>
                          {PAYMENT_METHOD_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FieldError>{errors.paymentMethod?.message}</FieldError>
                </Field>
              </div>

              <Field>
                <FieldLabel>Notas</FieldLabel>
                <Textarea
                  className="min-h-24 resize-y"
                  placeholder="Resumo ou observações financeiras..."
                  {...register("notes")}
                />
                <FieldError>{errors.notes?.message}</FieldError>
              </Field>
            </FieldGroup>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Voltar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Fechando..." : "Fechar fatura"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

export default DialogPaymentAccumulated
