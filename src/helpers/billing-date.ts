/**
 * Retorna a próxima data de vencimento a partir do billingDay.
 * - Se billingDay ainda não passou neste mês → este mês
 * - Se já passou → próximo mês
 * - Se billingDay > dias do mês → clamp pro último dia
 */
export function getNextBillingDate(
  billingDay: number,
  today: Date = new Date(),
): Date {
  const year = today.getFullYear()
  const month = today.getMonth()
  const todayDay = today.getDate()

  const targetMonth = billingDay >= todayDay ? month : month + 1

  // Clamp pro último dia do mês alvo
  const lastDayOfTargetMonth = new Date(year, targetMonth + 1, 0).getDate()
  const safeDay = Math.min(billingDay, lastDayOfTargetMonth)

  return new Date(year, targetMonth, safeDay, 12, 0, 0)
}
