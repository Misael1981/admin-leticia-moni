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
