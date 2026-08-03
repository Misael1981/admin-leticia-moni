export const MOCK_PATIENT_SUMMARY = {
  status: "Em Tratamento",
  sessoesRealizadas: 6,
  sessoesTotais: 10,
  dorAtual: 3, // escala de 0 a 10
  dorInicial: 8,
  ultimaSessao: "30/07/2026",
  diagnostico:
    "Tendinopatia do Supraespinhal à direita com limitação de ADM (Amplitude de Movimento) para abdução e rotação externa.",
  objetivos: [
    "Reduzir a dor em repouso para grau 0 em até 2 semanas",
    "Restabelecer ADM completa de abdução de ombro (180°)",
    "Fortalecimento da musculatura do manguito rotador",
  ],
  planoTerapêutico:
    "Eletroterapia analgésica (TENS) + Cinesioterapia progressiva (ganho de ADM e fortalecimento) 2x por semana.",
  alertas: [
    "Paciente relata sensibilidade aumentada no frio",
    "Histórico de hipertensão arterial controlada",
  ],
  timelineEvents: [
    {
      id: 1,
      date: "15/07/2026",
      title: "Avaliação Inicial & Anamnese",
      status: "completed",
    },
    {
      id: 2,
      date: "22/07/2026",
      title: "Ganho de ADM + Cinesioterapia Leve",
      status: "completed",
    },
    {
      id: 3,
      date: "30/07/2026",
      title: "Início de Fortalecimento com Carga Leve",
      status: "completed",
    },
    {
      id: 4,
      date: "05/08/2026",
      title: "Reavaliação de Amplitude e Dor",
      status: "upcoming",
    },
  ],
  ultimaEvolucao: {
    data: "30/07/2026",
    profissional: "Dr. Misael",
    relato:
      "Paciente relata diminuição substancial da dor matinal (EVA 3). Realizado protocolo de TENS por 20min + mobilização articular glenoumeral grau III + exercícios com theraband amarela. Boa tolerância sem dores agudas.",
  },
  videosPrescritos: [
    {
      id: 1,
      title: "Mobilização Passiva de Ombro com Bastão",
      duracao: "3 min",
      frequencia: "2x ao dia",
    },
    {
      id: 2,
      title: "Isometria de Manguito Rotador com Elástico",
      duracao: "5 min",
      frequencia: "1x ao dia",
    },
  ],
  arquivos: [
    {
      id: 1,
      name: "Ressonancia_Magnetica_Ombro_Dir.pdf",
      size: "2.4 MB",
      type: "Exame de Imagem",
    },
    {
      id: 2,
      name: "Encaminhamento_Ortopedista.pdf",
      size: "1.1 MB",
      type: "Laudo Médico",
    },
  ],
}
