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
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChargeFormInput, chargeFormSchema } from "@/schemas/payment.schemas"
import { toast } from "sonner"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { CurrencyInput } from "@/components/CurrencyInput"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PAYMENT_METHOD_OPTIONS } from "@/constants/options"
import { Textarea } from "@/components/ui/textarea"
import { formatDate } from "@/helpers/format-date"

type DialogPaymentProps = {
  isOpen: boolean
  onClose: () => void
  session: UnpaidSessionType
}

const DialogPayment = ({ isOpen, onClose, session }: DialogPaymentProps) => {
  const [isPending, startTransition] = useTransition()

  const { charge } = session

  const initialSubtotal =
    charge?.subtotal != null
      ? Number(charge.subtotal)
      : Number(session.amount ?? 0)
  const initialDiscount = charge?.discount != null ? Number(charge.discount) : 0
  const initialPaidAmount =
    charge?.paidAmount != null ? Number(charge.paidAmount) : 0

  const methods = useForm<ChargeFormInput>({
    resolver: zodResolver(chargeFormSchema),
    defaultValues: {
      discount: initialDiscount,
      paidAmount: initialPaidAmount,

      paymentMethod: charge?.paymentMethod ?? undefined,
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

  const discount = useWatch({
    control,
    name: "discount",
  })

  useEffect(() => {
    if (isOpen) {
      const discountVal = charge?.discount != null ? Number(charge.discount) : 0
      const paidAmountVal =
        charge?.paidAmount != null ? Number(charge.paidAmount) : 0

      reset({
        discount: discountVal,
        paidAmount: paidAmountVal,

        paymentMethod: charge?.paymentMethod || undefined,
        notes: charge?.notes || "",
      })
    }
  }, [isOpen, session.id, charge, reset])

  const total = initialSubtotal - Number(discount ?? 0)

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
        <DialogHeader className="space-y-4">
          <div className="space-y-1">
            <DialogTitle>Gerenciar Boleto</DialogTitle>
            <DialogDescription>
              Confira os dados e registre o pagamento
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="bg-muted/40 space-y-4 rounded-lg border p-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                Valor inicial
              </p>
              <p className="text-lg font-semibold text-green-600">
                {formatCurrency(initialSubtotal)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                Vencimento
              </p>
              <p className="text-lg font-semibold">
                {charge?.dueDate ? formatDate(charge.dueDate) : "—"}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
              Total a pagar
            </span>
            <span className="text-xl font-bold text-green-600">
              {formatCurrency(total)}
            </span>
          </div>
        </div>

        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit, onError)}
            className="space-y-4"
          >
            <FieldGroup className="custom-scroll max-h-[calc(95vh-300px)] overflow-y-auto pr-1 pb-4">
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
