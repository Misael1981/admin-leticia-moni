import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type CardsMetricsProps = {
  metric: {
    id: number
    title: string
    value: number | string
    trend: "up" | "down" | "neutral"
    trendValue?: string | number | undefined
  }
  icon?: React.ReactNode
}

const trendStyles = {
  up: "text-green-500",
  down: "text-red-500",
  neutral: "text-blue-500",
} as const

const trendIcons = {
  up: "↑ ",
  down: "↓ ",
  neutral: "",
} as const

const CardsMetrics = ({ metric, icon }: CardsMetricsProps) => {
  return (
    <Card className="w-full max-w-xs transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-muted-foreground text-sm font-medium">
          {metric.title}
        </CardTitle>

        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>

      <CardContent className="flex items-center justify-between">
        <div className="text-2xl font-bold">{metric.value}</div>

        <div>
          {metric.trendValue && (
            <p className={`mt-1 text-xs ${trendStyles[metric.trend]}`}>
              {trendIcons[metric.trend]}
              {metric.trendValue}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default CardsMetrics
