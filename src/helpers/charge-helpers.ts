import { ChargeStatus } from "@misael1981/physio-database"

export function deriveChargeStatus({
  status,
  paidAmount,
  total,
  dueDate,
}: {
  status: ChargeStatus
  paidAmount: number
  total: number
  dueDate: Date | string | null
}): ChargeStatus {
  if (status === "CANCELED") return "CANCELED"
  if (status === "PAID" || paidAmount >= total) return "PAID"

  if (dueDate) {
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)

    const due = new Date(dueDate)
    due.setHours(0, 0, 0, 0)

    if (due < hoje) return "OVERDUE"
  }

  return "OPEN"
}

export type AccumulatedOpenStatus = Extract<ChargeStatus, "OPEN" | "OVERDUE">

/**
 * Deriva o status visual de um conjunto de ChargeItems órfãos (ACCUMULATED).
 * NÃO persiste no banco — é cálculo de UI.
 *
 * - billingDay null → nunca atrasa (paciente sem dia definido)
 * - billingDay < hoje → OVERDUE (o admin tá devendo fechar/cobrar)
 * - billingDay >= hoje → OPEN (dentro do prazo)
 */
export function deriveAccumulatedOpenStatus(
  billingDay: number | null,
  today: Date = new Date(),
): AccumulatedOpenStatus {
  if (billingDay === null) return "OPEN"
  return billingDay < today.getDate() ? "OVERDUE" : "OPEN"
}
