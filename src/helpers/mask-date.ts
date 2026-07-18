export function maskDate(value: string) {
  const numbers = value.replace(/\D/g, "").slice(0, 8)

  if (numbers.length <= 2) return numbers
  if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`

  return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4)}`
}

export function formatDateToISO(value: string): string | null {
  const numbers = value.replace(/\D/g, "")

  if (numbers.length !== 8) return null

  const day = numbers.slice(0, 2)
  const month = numbers.slice(2, 4)
  const year = numbers.slice(4, 8)

  return `${year}-${month}-${day}`
}
