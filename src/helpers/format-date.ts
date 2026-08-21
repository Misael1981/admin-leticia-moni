export function formatDate(date: string | Date | null | undefined) {
  if (!date) return "N/A"

  const parsedDate = date instanceof Date ? date : new Date(date)

  if (Number.isNaN(parsedDate.getTime())) return "N/A"

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parsedDate)
}

export function formatSessionTime(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()

  const isToday = date.toDateString() === now.toDateString()

  const timeFormatter = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })

  if (isToday) {
    return `Hoje às ${timeFormatter.format(date)}`
  }

  const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })

  // Ex: 01/08 às 12:49
  return dateFormatter.format(date).replace(",", " às")
}
