type MetricCardProps = {
  title: string
  icon: React.ReactNode
  content: React.ReactNode
}

const MetricCard = ({ title, icon, content }: MetricCardProps) => {
  return (
    <div className="flex items-center justify-between rounded-xl border p-4 shadow-sm">
      <div>
        <p className="text-xs font-medium tracking-wider text-slate-500 uppercase">
          {title}
        </p>

        {content}
      </div>

      {icon}
    </div>
  )
}

export default MetricCard
