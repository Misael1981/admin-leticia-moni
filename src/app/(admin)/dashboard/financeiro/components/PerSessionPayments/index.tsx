"use client"

import { Card } from "@/components/ui/card"
import SubCard from "@/components/ui/sub-card"
import { ChargeStatus, PaymentMethod } from "@/constants/enums"
import { formatCurrency } from "@/helpers/format-currency"
import { formatDate } from "@/helpers/format-date"
import { useState } from "react"
import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import DialogPayment from "./components/DialogPayment"

export type UnpaidSessionType = {
  id: string

  charge: {
    id: string
    status: ChargeStatus
    subtotal: number
    discount: number
    total: number
    dueDate: string | null
    paidAt: string | null
    canceledAt: string | null
    paymentMethod: PaymentMethod | null
    notes: string | null
  } | null

  amount: number

  patient: {
    name: string
    id: string
    phone: string | null
  }

  evolution: {
    id: string
    sessionDate: string
  }
}

type PerSessionPaymentsProps = {
  unpaidSessions: UnpaidSessionType[]
}

const PerSessionPayments = ({ unpaidSessions }: PerSessionPaymentsProps) => {
  const [isDialogPayment, setDialogPayment] = useState(false)

  const handleDialog = () => {
    setDialogPayment(true)
  }

  return (
    <section>
      <Card className="p-4">
        <h3 className="font-heading text-lg leading-normal font-medium group-data-[size=sm]/card:text-sm">
          Pagamentos por Consulta
        </h3>

        {unpaidSessions.map((p) => (
          <SubCard key={p.id}>
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4 border-b pb-4">
                <div className="min-w-0">
                  <h4 className="truncate font-medium">{p.patient.name}</h4>
                  <span className="text-muted-foreground text-sm">
                    <strong>Data da consulta: </strong>
                    {formatDate(p.evolution.sessionDate)}
                  </span>
                </div>
                <span className="shrink-0 text-lg font-semibold text-green-600">
                  {formatCurrency(p.amount)}
                </span>
              </div>

              <div className="flex flex-col justify-end gap-4 md:flex-row">
                <Link
                  href={`https://wa.me/${p.patient.phone?.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`gap-2 ${buttonVariants({ variant: "outline" })} w-full border-emerald-200 text-emerald-600 hover:text-emerald-400 md:w-fit`}
                >
                  <MessageCircle className="h-4 w-4" />
                  Enviar Mensagem
                </Link>

                <Button onClick={handleDialog}>Registrar pagamento</Button>
              </div>
            </div>

            <DialogPayment
              isOpen={isDialogPayment}
              onClose={() => setDialogPayment(false)}
              session={p}
            />
          </SubCard>
        ))}
      </Card>
    </section>
  )
}

export default PerSessionPayments
