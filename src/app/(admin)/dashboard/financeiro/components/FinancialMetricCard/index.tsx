import { LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/helpers/format-currency"

interface FinancialMetricCardProps {
  title: string
  amount: number
  icon: LucideIcon
  description?: string
  variant?: "default" | "success" | "warning" | "danger"
}

const variantStyles = {
  default: {
    iconBg: "bg-primary/10 text-primary",
    amountColor: "text-foreground",
  },
  success: {
    iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    amountColor: "text-emerald-600 dark:text-emerald-400",
  },
  warning: {
    iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    amountColor: "text-amber-600 dark:text-amber-400",
  },
  danger: {
    iconBg: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    amountColor: "text-rose-600 dark:text-rose-400",
  },
}

export const FinancialMetricCard = ({
  title,
  amount,
  icon: Icon,
  description,
  variant = "default",
}: FinancialMetricCardProps) => {
  const style = variantStyles[variant]

  return (
    <Card className="w-full max-w-3xs p-4 transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0">
        <CardTitle className="text-muted-foreground text-sm font-medium">
          {title}
        </CardTitle>

        <div className={`rounded-xl p-2.5 ${style.iconBg}`}>
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div
          className={`text-2xl font-bold tracking-tight ${style.amountColor}`}
        >
          {formatCurrency(amount)}
        </div>

        {description && (
          <p className="text-muted-foreground mt-1 text-xs">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}
