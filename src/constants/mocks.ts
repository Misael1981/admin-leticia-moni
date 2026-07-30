export type EvolutionMockType = {
  id: string
  sessionDate: Date
  sessionNumber: number
  painScore: number
  notes: string
  prescriptions: {
    id: string
    order: number
    videoName: string
    sets: number
    reps: number | null
    holdTimeSec: number | null
    frequency: string
  }[]
}

export const evolutionMock = [
  {
    id: "session-1",
    sessionDate: new Date("2026-07-10T09:00:00"),
    sessionNumber: 1,
    painScore: 8,
    notes: `
      <p>Paciente iniciou tratamento relatando dor intensa na região lombar, principalmente durante flexão do tronco. Apresenta limitação de mobilidade e desconforto ao permanecer sentado por longos períodos.</p>

      <p>Realizada terapia manual, alongamentos leves e orientações posturais. Boa aceitação ao tratamento.</p>
    `,
    prescriptions: [
      {
        id: "video-1",
        order: 1,
        videoName: "Alongamento da Cadeia Posterior",
        sets: 3,
        reps: 10,
        holdTimeSec: 30,
        frequency: "2x ao dia",
      },
      {
        id: "video-2",
        order: 2,
        videoName: "Mobilização Lombar",
        sets: 2,
        reps: 15,
        holdTimeSec: null,
        frequency: "1x ao dia",
      },
    ],
  },

  {
    id: "session-2",
    sessionDate: new Date("2026-07-15T09:00:00"),
    sessionNumber: 2,
    painScore: 5,
    notes: `
      <p>Paciente relata melhora significativa da dor desde a última sessão. Mantém leve desconforto ao permanecer muito tempo em pé.</p>

      <p>Iniciados exercícios de fortalecimento do core e progressão dos exercícios domiciliares.</p>
    `,
    prescriptions: [
      {
        id: "video-3",
        order: 1,
        videoName: "Ponte para Fortalecimento do Core",
        sets: 3,
        reps: 12,
        holdTimeSec: 5,
        frequency: "2x ao dia",
      },
      {
        id: "video-4",
        order: 2,
        videoName: "Prancha Isométrica",
        sets: 3,
        reps: null,
        holdTimeSec: 20,
        frequency: "1x ao dia",
      },
    ],
  },

  {
    id: "session-3",
    sessionDate: new Date("2026-07-22T09:00:00"),
    sessionNumber: 3,
    painScore: 2,
    notes: `
      <p>Paciente apresenta excelente evolução clínica. Dor mínima apenas após esforços intensos. Amplitude de movimento praticamente normal.</p>

      <p>Mantidos exercícios de fortalecimento e iniciado treino funcional para retorno gradual às atividades habituais.</p>
    `,
    prescriptions: [
      {
        id: "video-5",
        order: 1,
        videoName: "Agachamento Assistido",
        sets: 3,
        reps: 15,
        holdTimeSec: null,
        frequency: "1x ao dia",
      },
      {
        id: "video-6",
        order: 2,
        videoName: "Equilíbrio Unipodal",
        sets: 3,
        reps: 10,
        holdTimeSec: 15,
        frequency: "1x ao dia",
      },
      {
        id: "video-7",
        order: 3,
        videoName: "Alongamento de Flexores do Quadril",
        sets: 2,
        reps: 8,
        holdTimeSec: 30,
        frequency: "2x ao dia",
      },
    ],
  },
]
