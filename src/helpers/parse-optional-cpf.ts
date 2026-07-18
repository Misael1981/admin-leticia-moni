export const parseOptionalCPF = (val: string | null | undefined) => {
  if (!val) return null
  const cleaned = val.replace(/\D/g, "")
  return cleaned === "" ? null : cleaned
}
