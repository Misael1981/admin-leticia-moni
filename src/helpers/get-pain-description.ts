export const getPainDescription = (value: number | null | undefined) => {
  if (value == null) return "Selecione a intensidade da dor."

  if (value === 0) return "Sem dor"
  if (value <= 3) return "Dor leve"
  if (value <= 6) return "Dor moderada"
  if (value <= 9) return "Dor intensa"

  return "Pior dor possível"
}
