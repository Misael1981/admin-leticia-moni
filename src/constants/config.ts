import { AppointmentStatus } from "./enums"

export interface StatusConfig {
  label: string
  variant: string
  badgeStyle: string
  borderStyle: string
  bgStyle: string
}

export const APPOINTMENT_STATUS_CONFIG: Record<
  AppointmentStatus,
  StatusConfig
> = {
  SCHEDULED: {
    label: "Agendado",
    variant: "outline",
    badgeStyle:
      "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-200",
    borderStyle: "border-l-blue-500",
    bgStyle: "bg-blue-500/5 hover:bg-blue-500/10",
  },
  CONFIRMED: {
    label: "Confirmado",
    variant: "default",
    badgeStyle:
      "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-200",
    borderStyle: "border-l-emerald-500",
    bgStyle: "bg-emerald-500/5 hover:bg-emerald-500/10",
  },
  IN_PROGRESS: {
    label: "Em Andamento",
    variant: "default",
    badgeStyle:
      "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-200 animate-pulse",
    borderStyle: "border-l-amber-500",
    bgStyle: "bg-amber-500/5 hover:bg-amber-500/10",
  },
  COMPLETED: {
    label: "Concluído",
    variant: "secondary",
    badgeStyle:
      "bg-slate-500/15 text-slate-700 dark:text-slate-400 border-slate-200",
    borderStyle: "border-l-slate-400",
    bgStyle: "bg-slate-500/5 hover:bg-slate-500/10",
  },
  CANCELED: {
    label: "Cancelado",
    variant: "destructive",
    badgeStyle:
      "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-200",
    borderStyle: "border-l-rose-500",
    bgStyle: "bg-rose-500/5 hover:bg-rose-500/10 opacity-75",
  },
  NO_SHOW: {
    label: "Faltou",
    variant: "outline",
    badgeStyle:
      "bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-200",
    borderStyle: "border-l-purple-500",
    bgStyle: "bg-purple-500/5 hover:bg-purple-500/10",
  },
}
