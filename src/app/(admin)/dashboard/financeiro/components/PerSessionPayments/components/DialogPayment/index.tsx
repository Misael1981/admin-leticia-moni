"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { UnpaidSessionType } from "../.."
import { formatCurrency } from "@/helpers/format-currency"
import { Button } from "@/components/ui/button"
import { useEffect, useTransition } from "react"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChargeFormInput, chargeFormSchema } from "@/schemas/payment.schemas"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { CHARGE_STATUS_CONFIG } from "@/constants/config"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { CurrencyInput } from "@/components/CurrencyInput"
import { DatePickerInput } from "@/components/DatePickerInput"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PAYMENT_METHOD_OPTIONS } from "@/constants/options"
import { Textarea } from "@/components/ui/textarea"

type DialogPaymentProps = {
  isOpen: boolean
  onClose: () => void
  session: UnpaidSessionType
}

const DialogPayment = ({ isOpen, onClose, session }: DialogPaymentProps) => {
  const [isPending, startTransition] = useTransition()

  const { charge } = session
  const chargeStatus = charge?.status

  const initialSubtotal =
    charge?.subtotal != null
      ? Number(charge.subtotal)
      : Number(session.amount ?? 0)
  const initialDiscount = charge?.discount != null ? Number(charge.discount) : 0
  const initialPaidAmount =
    charge?.paidAmount != null ? Number(charge.paidAmount) : 0
  const initialTotal =
    charge?.total != null
      ? Number(charge.total)
      : initialSubtotal - initialDiscount

  const methods = useForm<ChargeFormInput>({
    resolver: zodResolver(chargeFormSchema),
    defaultValues: {
      status: charge?.status || "OPEN",
      subtotal: initialSubtotal,
      discount: initialDiscount,
      paidAmount: initialPaidAmount,
      total: initialTotal,

      dueDate: charge?.dueDate ? new Date(charge.dueDate) : new Date(),
      paidAt: charge?.paidAt ? new Date(charge.paidAt) : undefined,
      canceledAt: charge?.canceledAt ? new Date(charge.canceledAt) : undefined,

      paymentMethod: charge?.paymentMethod || "PIX",
      notes: charge?.notes || "",
    },
  })

  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { errors },
  } = methods

  useEffect(() => {
    if (isOpen) {
      const subtotalVal =
        charge?.subtotal != null
          ? Number(charge.subtotal)
          : Number(session.amount ?? 0)
      const discountVal = charge?.discount != null ? Number(charge.discount) : 0
      const paidAmountVal =
        charge?.paidAmount != null ? Number(charge.paidAmount) : 0
      const totalVal =
        charge?.total != null ? Number(charge.total) : subtotalVal - discountVal

      reset({
        status: charge?.status || "OPEN",
        subtotal: subtotalVal,
        discount: discountVal,
        paidAmount: paidAmountVal,
        total: totalVal,

        dueDate: charge?.dueDate ? new Date(charge.dueDate) : new Date(),
        paidAt: charge?.paidAt ? new Date(charge.paidAt) : undefined,
        canceledAt: charge?.canceledAt
          ? new Date(charge.canceledAt)
          : undefined,

        paymentMethod: charge?.paymentMethod || "PIX",
        notes: charge?.notes || "",
      })
    }
  }, [isOpen, session, charge, reset])

  const onSubmit = async (data: ChargeFormInput) => {
    startTransition(async () => {
      try {
        console.log("Dados recebidos para envio:", data)
        onClose()
      } catch (error) {
        console.error("Erro ao alterar status de pagamento:", error)
        toast.error("Ocorreu um erro ao alterar status de pagamento.")
      }
    })
  }

  const onError = (errors: unknown) => {
    console.log("❌ O ZOD BLOQUEOU O ENVIO NESSES CAMPOS:", errors)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Gerenciar Boleto</DialogTitle>
          <DialogDescription>
            Valor a ser pago{" "}
            <strong className="text-green-600">
              {formatCurrency(session.amount)}
            </strong>
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end">
          {session.isReturn ? (
            <Badge className="border border-blue-200 bg-blue-500/10 font-medium text-blue-600">
              Retorno
            </Badge>
          ) : chargeStatus ? (
            (() => {
              const statusConfig = CHARGE_STATUS_CONFIG[chargeStatus]
              return (
                <Badge
                  className={`border font-medium ${statusConfig.badgeStyle}`}
                >
                  {statusConfig.label}
                </Badge>
              )
            })()
          ) : (
            <Badge className="border border-slate-200 bg-slate-500/10 font-medium text-slate-600">
              A faturar
            </Badge>
          )}
        </div>

        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit, onError)}
            className="space-y-4"
          >
            <FieldGroup className="custom-scroll max-h-[calc(95vh-220px)] overflow-y-auto pr-1 pb-4">
              <div className="grid grid-cols-2 gap-4">
                <CurrencyInput name="subtotal" label="Subtotal" />
                <CurrencyInput name="discount" label="Desconto" />
                <CurrencyInput name="paidAmount" label="Pagamento Parcial" />
                <CurrencyInput name="total" label="Total" />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <DatePickerInput name="dueDate" label="Vencimento" />
                <DatePickerInput name="paidAt" label="Data do Pagamento" />
              </div>

              <div className="flex justify-center">
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
                {isPending ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

export default DialogPayment
