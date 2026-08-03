type ActionCardProps<T> = {
  title: string
  icon: React.ReactNode
  items: T[]
  renderItem: (item: T) => React.ReactNode
}

function ActionCard<T>({
  title,
  icon,
  items,
  renderItem,
}: ActionCardProps<T>) {
  return (
    <div className="space-y-6 rounded-xl border p-4 shadow-sm">
      <h3 className="mb-6 flex items-center gap-2 text-sm font-semibold">
        {icon}
        {title}
      </h3>

      <div className="space-y-4">{items.map(renderItem)}</div>
    </div>
  )
}

export default ActionCard
