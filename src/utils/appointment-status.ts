import { APPOINTMENT_STATUS_CONFIG, StatusConfig } from "@/constants/config"
import { AppointmentStatus } from "@/constants/enums"

interface AppointmentTimeInfo {
  status: AppointmentStatus
  startTime: Date | string
  endTime: Date | string
}

/**
 * Calcula o status visual em tempo real com base na hora atual.
 * Se o status manual for de exceção (CANCELED ou NO_SHOW), ele é respeitado integralmente.
 */
export function getDerivedStatusConfig(
  appointment: AppointmentTimeInfo,
): StatusConfig {
  const { status, startTime, endTime } = appointment

  // 1. Status de exceção marcados manualmente pela recepção NUNCA são sobrescritos pelo horário
  if (status === "CANCELED" || status === "NO_SHOW") {
    return APPOINTMENT_STATUS_CONFIG[status]
  }

  const now = new Date()
  const start = new Date(startTime)
  const end = new Date(endTime)

  // 2. Se a hora atual passou do horário de término -> Concluído
  if (now >= end) {
    return APPOINTMENT_STATUS_CONFIG.COMPLETED
  }

  // 3. Se a hora atual está entre o início e o término -> Em Andamento
  if (now >= start && now < end) {
    return APPOINTMENT_STATUS_CONFIG.IN_PROGRESS
  }

  // 4. Se ainda não chegou o horário -> Retorna o status original do banco (AGENDADO / CONFIRMADO)
  return APPOINTMENT_STATUS_CONFIG[status]
}
