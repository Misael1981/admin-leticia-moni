export function generateWhatsAppLink(phone: string, patientName: string) {
  const cleanPhone = phone.replace(/\D/g, "")

  const formattedPhone =
    cleanPhone.length <= 11 ? `55${cleanPhone}` : cleanPhone

  const message = `Olá, ${patientName}! Tudo bem? Entro em contato referente ao seu atendimento fisioterapêutico.`
  const encodedMessage = encodeURIComponent(message)

  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`
}
