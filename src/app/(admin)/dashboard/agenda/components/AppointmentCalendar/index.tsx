"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import NewAppointmentSheet from "../NewAppointmentSheet"

export default function AppointmentCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [isOpenNewAppointmentSheet, setIsOpenNewAppointmentSheet] =
    useState(false)

  const handleOpenNewAppointmentSheet = () => {
    setIsOpenNewAppointmentSheet(true)
  }

  // TODO: Buscar agendamentos do backend com base na `selectedDate`

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

        {/* 3. Lista de Horários do Dia ( Timeline ) */}
        <div className="space-y-3 pt-2">
          {/* Exemplo visual de um item da lista */}
          <div className="flex cursor-pointer items-center gap-4 rounded-lg border border-l-4 border-l-emerald-500 bg-emerald-500/5 p-3 transition-colors hover:bg-emerald-500/10">
            <div className="text-muted-foreground w-16 text-sm font-bold">
              14:00
            </div>
            <div className="flex-1">
              <p className="text-foreground font-semibold">Maria Silva</p>
              <p className="text-muted-foreground text-xs">
                Acupuntura • Sessão 2 de 10
              </p>
            </div>
            <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-medium text-emerald-700">
              Confirmado
            </span>
          </div>

          <div className="flex cursor-pointer items-center gap-4 rounded-lg border border-l-4 border-l-blue-500 bg-blue-500/5 p-3 transition-colors hover:bg-blue-500/10">
            <div className="text-muted-foreground w-16 text-sm font-bold">
              15:30
            </div>
            <div className="flex-1">
              <p className="text-foreground font-semibold">João Pereira</p>
              <p className="text-muted-foreground text-xs">
                Fisioterapia Motora • Sessão 5 de 10
              </p>
            </div>
            <span className="rounded-full bg-blue-500/20 px-2.5 py-1 text-xs font-medium text-blue-700">
              Agendado
            </span>
          </div>
        </div>
      </div>

      <NewAppointmentSheet
        open={isOpenNewAppointmentSheet}
        onOpenChange={setIsOpenNewAppointmentSheet}
        selectedDate={selectedDate}
        patients={[
          { id: "patient-1", name: "Maria Silva" },
          { id: "patient-2", name: "João Pereira" },
          { id: "patient-3", name: "Ana Souza" },
        ]}
        physiotherapists={[
          { id: "physio-1", name: "Letícia" },
          { id: "physio-2", name: "Carlos Mendes" },
        ]}
        treatments={[
          {
            id: "treatment-1",
            name: "Acupuntura",
            defaultDurationMinutes: 60,
          },
          {
            id: "treatment-2",
            name: "Fisioterapia Motora",
            defaultDurationMinutes: 45,
          },
        ]}
        clinicId="clinic-1"
      />
    </div>
  )
}
