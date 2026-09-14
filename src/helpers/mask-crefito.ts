export function maskCrefito(value: string): string {
  let cleanValue = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()
  cleanValue = cleanValue.slice(0, 8)
  return cleanValue.replace(/^(\d{1,6})([A-Z]{1,2})$/, "$1-$2")
}
