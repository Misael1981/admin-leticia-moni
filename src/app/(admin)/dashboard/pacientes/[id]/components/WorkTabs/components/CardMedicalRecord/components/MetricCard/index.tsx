type MetricCardProps = {
  title: string
  value: number | string
  icon: React.ReactNode
}

const MetricCard = ({ title, value, icon }: MetricCardProps) => {
  return (
    <div className="flex items-center justify-between rounded-xl border p-4 shadow-sm">
      <div>
        <p className="text-xs font-medium tracking-wider text-slate-500 uppercase">
          {title}
        </p>

        <span className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          {value}
        </span>
      </div>

      {icon}
    </div>
  )
}

export default MetricCard
