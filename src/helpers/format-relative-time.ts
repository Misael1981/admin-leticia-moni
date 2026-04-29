export function formatRelativeTime(date: string) {
  const now = new Date()
  const past = new Date(date)

  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

  const minutes = Math.floor(diffInSeconds / 60)
  const hours = Math.floor(diffInSeconds / 3600)
  const days = Math.floor(diffInSeconds / 86400)

  if (minutes < 1) return "agora mesmo"
  if (minutes < 60) return `há ${minutes} min`
  if (hours < 24) return `há ${hours}h`
  return `há ${days}d`
}
