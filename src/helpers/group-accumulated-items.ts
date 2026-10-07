import type { SerializedAccumulatedOpenItem } from "@/data/financial/get-charge-accumulated"
import {
  deriveAccumulatedOpenStatus,
  type AccumulatedOpenStatus,
} from "@/helpers/charge-helpers"

export type AccumulatedPatientGroup = {
  patient: SerializedAccumulatedOpenItem["patient"]
  items: SerializedAccumulatedOpenItem[]
  total: number
  count: number
  status: AccumulatedOpenStatus
}

export function groupAccumulatedByPatient(
  items: SerializedAccumulatedOpenItem[],
  today: Date = new Date(),
): AccumulatedPatientGroup[] {
  const map = new Map<string, AccumulatedPatientGroup>()

  for (const item of items) {
    const patientId = item.patient.id
    const value = item.adjustedAmount ?? item.amount

    let group = map.get(patientId)
    if (!group) {
      group = {
        patient: item.patient,
        items: [],
        total: 0,
        count: 0,
        status: "OPEN",
      }
      map.set(patientId, group)
    }

    group.items.push(item)
    group.total += value
    group.count += 1
  }

  // Deriva status depois de agrupar (usa billingDay do paciente)
  for (const group of map.values()) {
    group.status = deriveAccumulatedOpenStatus(group.patient.billingDay, today)
  }

  return Array.from(map.values())
}
