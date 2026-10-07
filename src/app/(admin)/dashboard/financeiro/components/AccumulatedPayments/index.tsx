"use client"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import SubCard from "@/components/ui/sub-card"
import { ACCUMULATED_OPEN_STATUS_CONFIG } from "@/constants/config"
import type { SerializedAccumulatedOpenItem } from "@/data/financial/get-charge-accumulated"
import {
  AccumulatedPatientGroup,
  groupAccumulatedByPatient,
} from "@/helpers/group-accumulated-items"
import { formatCurrency } from "@/helpers/format-currency"
import { MessageCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import DialogPaymentAccumulated from "./components/DialogPaymentAccumulated"

type AccumulatedPaymentsProps = {
  unpaidItems: SerializedAccumulatedOpenItem[]
}

const AccumulatedPayments = ({ unpaidItems }: AccumulatedPaymentsProps) => {
  const groups = groupAccumulatedByPatient(unpaidItems)
  const [selectedGroup, setSelectedGroup] =
    useState<AccumulatedPatientGroup | null>(null)

  const handleOpenDialog = (group: AccumulatedPatientGroup) => {
    setSelectedGroup(group)
  }

  const handleCloseDialog = () => {
    setSelectedGroup(null)
  }

  return (
    <Card className="p-4">
      <h3 className="font-heading text-lg leading-normal font-medium group-data-[size=sm]/card:text-sm">
        Faturas mensais acumuladas
      </h3>

      {groups.length === 0 && (
        <p className="text-muted-foreground mt-4 text-center text-sm">
          Nenhuma consulta pendente de pagamento.
        </p>
      )}

      {groups.map((group) => {
        const statusConfig = ACCUMULATED_OPEN_STATUS_CONFIG[group.status]

        return (
          <SubCard key={group.patient.id}>
            <div className="space-y-6">
              <div className="flex justify-end">
                <Badge
                  className={`border font-medium ${statusConfig.badgeStyle}`}
                >
                  {statusConfig.label}
                </Badge>
              </div>

              <div className="flex items-start justify-between gap-4 border-b pb-4">
                <div className="min-w-0 space-y-2">
                  <h4 className="truncate font-medium">{group.patient.name}</h4>

                  <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                    <span>
                      {group.count}{" "}
                      {group.count === 1 ? "consulta" : "consultas"}
                    </span>

                    <span className="text-muted-foreground/50">•</span>

                    <div className="flex flex-wrap gap-1">
                      <span>Realizadas em:</span>
                      {group.items.map((item, index) => (
                        <span key={item.id}>
                          {new Date(
                            item.evolution.sessionDate,
                          ).toLocaleDateString("pt-BR")}
                          {index < group.items.length - 1 && ", "}
                        </span>
                      ))}
                    </div>
                  </div>

                  {group.patient.billingDay && (
                    <p className="text-muted-foreground text-xs">
                      Vence todo dia {group.patient.billingDay}
                    </p>
                  )}
                </div>

                <span className="shrink-0 text-lg font-semibold text-green-600">
                  {formatCurrency(group.total)}
                </span>
              </div>

              <div className="flex flex-col justify-end gap-4 md:flex-row">
                {group.patient.phone && (
                  <Link
                    href={`https://wa.me/${group.patient.phone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`gap-2 ${buttonVariants({ variant: "outline" })} w-full border-emerald-200 text-emerald-600 hover:text-emerald-400 md:w-fit`}
                  >
                    <MessageCircle className="h-4 w-4" />
                    Enviar Mensagem
                  </Link>
                )}
                <Button onClick={() => handleOpenDialog(group)}>
                  Registrar pagamento
                </Button>
              </div>
            </div>
          </SubCard>
        )
      })}

      <DialogPaymentAccumulated
        isOpen={!!selectedGroup}
        onClose={handleCloseDialog}
        group={selectedGroup}
      />
    </Card>
  )
}

export default AccumulatedPayments
