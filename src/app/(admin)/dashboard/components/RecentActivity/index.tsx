"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatRelativeTime } from "@/helpers/format-relative-time"

type Activity = {
  id: number
  description: string
  createdAt: string
}

type RecentActivityProps = {
  activities: Activity[]
}

const RecentActivity = ({ activities }: RecentActivityProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Atividade recente</CardTitle>
      </CardHeader>

      <CardContent>
        {activities.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Nenhuma atividade recente
          </p>
        ) : (
          <ul className="space-y-4">
            {activities.map((activity, index) => (
              <li key={activity.id} className="flex gap-3">
                {/* bolinha estilo timeline */}
                <div className="flex flex-col items-center">
                  <div className="bg-primary h-2 w-2 rounded-full" />
                  {index !== activities.length - 1 && (
                    <div className="bg-border mt-1 w-px flex-1" />
                  )}
                </div>

                <div className="flex flex-col">
                  <span className="text-sm">{activity.description}</span>

                  <span className="text-muted-foreground text-xs">
                    {formatRelativeTime(activity.createdAt)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

export default RecentActivity
