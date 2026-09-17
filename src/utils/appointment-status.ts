import { APPOINTMENT_STATUS_CONFIG, StatusConfig } from "@/constants/config"
import { AppointmentStatus } from "@/constants/enums"

interface AppointmentTimeInfo {
  status: AppointmentStatus
  startTime: Date | string
  endTime: Date | string
}

export function getDerivedStatusConfig(
  appointment: AppointmentTimeInfo,
): StatusConfig {
  const { status, startTime, endTime } = appointment

  if (status === "CANCELED" || status === "NO_SHOW") {
    return APPOINTMENT_STATUS_CONFIG[status]
  }

  const now = new Date()
  const start = new Date(startTime)
  const end = new Date(endTime)

  if (now >= end) {
    return APPOINTMENT_STATUS_CONFIG.COMPLETED
  }

  if (now >= start && now < end) {
    return APPOINTMENT_STATUS_CONFIG.IN_PROGRESS
  }

  return APPOINTMENT_STATUS_CONFIG[status]
}

export function getEffectiveStatus(
  appointment: AppointmentTimeInfo,
): AppointmentStatus {
  const currentStatus = appointment.status

  if (
    currentStatus === AppointmentStatus.CANCELED ||
    currentStatus === AppointmentStatus.NO_SHOW ||
    currentStatus === AppointmentStatus.COMPLETED
  ) {
    return currentStatus
  }

  const now = new Date()
  const start = new Date(appointment.startTime)
  const end = new Date(appointment.endTime)

  if (now >= end) {
    return AppointmentStatus.COMPLETED
  }

  if (now >= start && now < end) {
    return AppointmentStatus.IN_PROGRESS
  }

  return currentStatus
}
