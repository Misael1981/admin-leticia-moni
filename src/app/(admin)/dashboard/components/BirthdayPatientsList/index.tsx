"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Cake, PartyPopper, MessageCircle } from "lucide-react"
import { BirthdayPatient } from "@/data/get-overview-data"

type BirthdayPatientsProps = {
  patients: BirthdayPatient[]
}

const BirthdayPatientsList = ({ patients }: BirthdayPatientsProps) => {
  const handleWhatsAppClick = (phone: string | null, name: string) => {
    if (!phone) return
    const cleanPhone = phone.replace(/\D/g, "")
    const firstName = name.split(" ")[0]
    const message = encodeURIComponent(
      `Olá ${firstName}, parabéns pelo seu aniversário! 🎉 Desejamos muita saúde e paz da equipe da clínica!`,
    )
    window.open(`https://wa.me/55${cleanPhone}?text=${message}`, "_blank")
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Cake className="text-primary size-5" />
          Aniversariantes do Mês
        </CardTitle>
        <Badge variant="secondary">{patients.length}</Badge>
      </CardHeader>

      <CardContent>
        {patients.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Nenhum aniversariante este mês.
          </p>
        ) : (
          <ul className="space-y-3">
            {patients.map((patient) => (
              <li
                key={patient.id}
                className={`flex flex-col items-center justify-center gap-4 rounded-lg border p-3 transition-all md:flex-row md:justify-between ${
                  patient.isToday
                    ? "border-amber-500/50 bg-amber-500/10 shadow-sm dark:bg-amber-500/20"
                    : "hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  {patient.isToday ? (
                    <div className="flex size-9 animate-bounce items-center justify-center rounded-full bg-amber-500 text-white">
                      <PartyPopper size={18} />
                    </div>
                  ) : (
                    <div className="bg-muted text-muted-foreground flex size-9 items-center justify-center rounded-full text-center text-xs font-semibold">
                      {patient.dayMonth}
                    </div>
                  )}

                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="min-w-0 truncate text-sm font-medium">
                        {patient.name}
                      </span>
                      {patient.isToday && (
                        <Badge className="bg-amber-500 text-[10px] text-white hover:bg-amber-600">
                          Hoje! 🎉
                        </Badge>
                      )}
                    </div>

                    <span className="text-muted-foreground text-xs">
                      {patient.nickname ? `${patient.nickname} • ` : ""}
                      {patient.age} anos
                    </span>
                  </div>
                </div>

                {patient.phone && (
                  <Button
                    variant={patient.isToday ? "default" : "ghost"}
                    className={
                      patient.isToday
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "text-muted-foreground hover:text-emerald-600"
                    }
                    title="Enviar parabéns no WhatsApp"
                    onClick={() =>
                      handleWhatsAppClick(patient.phone, patient.name)
                    }
                  >
                    {patient.isToday && <span>Enviar Parabéns</span>}
                    <MessageCircle size={18} />
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

export default BirthdayPatientsList
