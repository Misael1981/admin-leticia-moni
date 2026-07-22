export function getPatientAge(birthDate: Date | null): number | null {
  if (!birthDate) return null

  const today = new Date()
  const birth = new Date(birthDate)

  let age = today.getFullYear() - birth.getFullYear()

  const hasHadBirthdayThisYear =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() &&
      today.getDate() >= birth.getDate())

  if (!hasHadBirthdayThisYear) {
    age--
  }

  return age
}

export function formatBirthDate(birthDate: Date | null): string {
  if (!birthDate) return "Não informado"

  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "UTC",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(birthDate))
}
