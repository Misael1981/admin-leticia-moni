"use client"

import { useEffect, useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { CalendarDays, Plus } from "lucide-react"
import NewAppointmentSheet from "../NewAppointmentSheet"
import { getAppointmentBySelectedDate } from "@/app/action/get-appointments"
import AppointmentCard from "../AppointmentCard"
import EmptyData from "@/components/EmptyData"
import { Calendar } from "@/components/ui/calendar"
import { Skeleton } from "@/components/ui/skeleton"

type AppointmentWithRelations = NonNullable<
  Awaited<ReturnType<typeof getAppointmentBySelectedDate>>["data"]
>[number]

type AppointmentCalendarProps = {
  clinicData: {
    patients: {
      id: string
      name: string
      evolution: {
        sessionNumber: number
      }[]
      treatments: {
        treatment: {
          id: string
          name: string
          sessionDurationMinutes: number | null
        }
      }[]
    }[]
    physiotherapists: {
      id: string
      name: string
    }[]
    treatments: {
      id: string
      name: string
      sessionDurationMinutes: number | null
    }[]
    id: string
  }
}

export default function AppointmentCalendar({
  clinicData,
}: AppointmentCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [isOpenNewAppointmentSheet, setIsOpenNewAppointmentSheet] =
    useState(false)
  const [appointments, setAppointments] = useState<AppointmentWithRelations[]>(
    [],
  )
  const [isPending, startTransition] = useTransition()

  // useEffect de mudança de data:
  useEffect(() => {
    if (!selectedDate) return

    startTransition(async () => {
      const response = await getAppointmentBySelectedDate(selectedDate)
      if (response.success && response.data) {
        setAppointments(response.data)
      }
    })
  }, [selectedDate])

  const handleOpenNewAppointmentSheet = () => {
    setIsOpenNewAppointmentSheet(true)
  }

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
      {/* 1. Calendário Mensal (Estilo Samsung Topo/Esquerda) */}
      <div className="bg-card rounded-xl border p-4 shadow-sm lg:col-span-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="flex w-full justify-center"
          captionLayout="dropdown"
        />
      </div>

      {/* 2. Timeline / Lista do Dia Selecionado */}
      <div className="bg-card min-h-100 space-y-4 rounded-xl border p-6 shadow-sm lg:col-span-8">
        <div className="flex flex-col items-center justify-center gap-6 border-b pb-4 md:flex-row md:justify-between">
          <div>
            <h2 className="text-lg font-semibold capitalize">
              {selectedDate
                ? selectedDate.toLocaleDateString("pt-BR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })
                : "Selecione uma data"}
            </h2>
            <p className="text-muted-foreground text-sm">
              Agendamentos para este dia
            </p>
          </div>

          <Button className="gap-2" onClick={handleOpenNewAppointmentSheet}>
            <Plus className="h-4 w-4" />
            Novo Agendamento
          </Button>
        </div>

        {isPending ? (
          <div className="space-y-3 pt-2">
            <Skeleton className="h-18 w-full rounded-lg" />
            <Skeleton className="h-18 w-full rounded-lg" />
            <Skeleton className="h-18 w-full rounded-lg" />
          </div>
        ) : appointments.length === 0 ? (
          <EmptyData
            icon={CalendarDays}
            title="Nenhuma Consulta Agendada Hoje"
          />
        ) : (
          <div className="space-y-3 pt-2">
            {appointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </div>
        )}
      </div>

      <NewAppointmentSheet
        open={isOpenNewAppointmentSheet}
        onOpenChange={setIsOpenNewAppointmentSheet}
        selectedDate={selectedDate}
        clinicData={clinicData}
      />
    </div>
  )
}
