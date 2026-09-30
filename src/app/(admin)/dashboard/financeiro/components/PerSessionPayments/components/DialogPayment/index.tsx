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
import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChargeFormInput, chargeFormSchema } from "@/schemas/payment.schemas"
import { toast } from "sonner"

type DialogPaymentProps = {
  isOpen: boolean
  onClose: () => void
  session: UnpaidSessionType
}

const DialogPayment = ({ isOpen, onClose, session }: DialogPaymentProps) => {
  const [isPending, startTransition] = useTransition()

  const { charge } = session

  const methods = useForm<ChargeFormInput>({
    resolver: zodResolver(chargeFormSchema),
    defaultValues: {
      status: charge?.status || "OPEN",

      subtotal: charge?.subtotal || undefined,
      discount: charge?.discount || undefined,
      total: charge?.total || undefined,

      dueDate: charge?.dueDate ? new Date(charge.dueDate) : undefined,
      paidAt: charge?.paidAt ? new Date(charge.paidAt) : undefined,
      canceledAt: charge?.canceledAt ? new Date(charge.canceledAt) : undefined,

      paymentMethod: charge?.paymentMethod || undefined,
      notes: charge?.notes || "",
    },
  })

  const { handleSubmit } = methods

  const onSubmit = async (data: ChargeFormInput) => {
    startTransition(async () => {
      try {
        console.log("Dados recebidos", data)
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gerenciar Boleto</DialogTitle>
          <DialogDescription>
            Valor a ser pago{" "}
            <strong className="text-green-600">
              {formatCurrency(session.amount)}
            </strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Voltar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Salvando..." : "Alterar Status"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default DialogPayment
