type AppointmentCardProps = {
  hour: string
  name: string
  service: string
  session: string
  status: "confirmed" | "pending" | "canceled"
}

const AppointmentCard = ({
  hour,
  name,
  service,
  session,
  status,
}: AppointmentCardProps) => {
  return (
    <div className="flex cursor-pointer items-center gap-4 rounded-lg border border-l-4 border-l-emerald-500 bg-emerald-500/5 p-3 transition-colors hover:bg-emerald-500/10">
      <div className="text-muted-foreground w-16 text-sm font-bold">{hour}</div>
      <div className="flex-1">
        <p className="text-foreground font-semibold">{name}</p>
        <p className="text-muted-foreground text-xs">
          {service} • {session}
        </p>
      </div>
      <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-medium text-emerald-700">
        {status === "confirmed" && "Confirmado"}
        {status === "pending" && "Pendente"}
        {status === "canceled" && "Cancelado"}
      </span>
    </div>
  )
}

export default AppointmentCard
