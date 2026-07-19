import { LucideIcon } from "lucide-react"

type EmptyDataProps = {
  title?: string
  description?: string
  icon?: LucideIcon
}

const EmptyData = ({ title, description, icon: Icon }: EmptyDataProps) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed px-8 py-16 text-center">
      {Icon && <Icon className="mb-4 size-14 text-slate-400" />}

      <h2 className="dark:text-primary text-lg font-semibold text-slate-800">
        {title}
      </h2>

      <p className="mt-2 max-w-md text-sm text-slate-500">{description}</p>
    </div>
  )
}

export default EmptyData
