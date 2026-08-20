export type TrendDirection = "up" | "down" | "neutral"

export type TrendResult = {
  trend: TrendDirection
  trendValue: string
}

export function calculateTrend(current: number, previous: number): TrendResult {
  if (current === previous) {
    return { trend: "neutral", trendValue: "0%" }
  }

  if (previous === 0) {
    return { trend: "up", trendValue: "100%" }
  }

  const diff = current - previous
  const percentage = Math.abs((diff / previous) * 100)

  const formattedPercentage = `${percentage.toFixed(1)}%`

  if (diff > 0) {
    return { trend: "up", trendValue: formattedPercentage }
  } else {
    return { trend: "down", trendValue: formattedPercentage }
  }
}
