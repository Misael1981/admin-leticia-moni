type ListCardProps = {
  title: string
  icon: React.ReactNode
  list: string[] | React.ReactNode[]
  iconItem?: React.ReactNode
  className?: string
}

const ListCard = ({
  title,
  icon,
  list,
  iconItem,
  className,
}: ListCardProps) => {
  return (
    <div className="rounded-xl border p-5 shadow-sm">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
        {icon}
        {title}
      </h3>
      <ul className="text-muted-foreground space-y-2 text-sm leading-relaxed">
        {list.map((item, idx) => (
          <li key={idx} className={`flex items-start gap-2 ${className}`}>
            {iconItem}
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ListCard
