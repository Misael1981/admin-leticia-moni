"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatSessionTime } from "@/helpers/format-date"
import Link from "next/link"

type Patient = {
  id: number
  name: string
  nickname: string
  createdAt: string
}

type RecentPatientsProps = {
  patients: Patient[]
}

const RecentPatients = ({ patients }: RecentPatientsProps) => {
  const recentPatients = patients.slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Últimos pacientes atendidos</CardTitle>
      </CardHeader>

      <CardContent>
        {recentPatients.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Nenhum paciente cadastrado ainda
          </p>
        ) : (
          <ul className="space-y-3">
            {recentPatients.map((patient) => (
              <li key={patient.id}>
                <Link
                  href={`/dashboard/pacientes/${patient.id}?tab=evolutions`}
                  className="hover:bg-muted/50 bg-background flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-all"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{patient.name}</span>
                    <span className="text-muted-foreground text-xs">
                      {patient.nickname}
                    </span>
                  </div>

                  <span className="text-muted-foreground text-xs">
                    {formatSessionTime(patient.createdAt)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

export default RecentPatients
