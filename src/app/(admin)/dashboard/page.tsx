import PageHeader from "@/components/PageHeader"
import QuickActions from "./components/QuickActions"
import UpcomingAppointments from "./components/UpcomingAppointments"
import RecentPatients from "./components/RecentPatients"
import MetricsGrid from "./components/MetricsGrid"
import {
  getMetricsOverview,
  getMonthBirthdayPatients,
  getRecentPatientsFromEvolutions,
} from "@/data/get-overview-data"
import BirthdayPatientsList from "./components/BirthdayPatientsList"
import { getCountTestimonialsByStatus } from "@/data/get-testimonials.queries"
import {
  ClipboardPlus,
  MessageSquarePlus,
  UserPlus,
  VideoIcon,
} from "lucide-react"
import {
  getUpcomingAppointments,
  type UpcomingAppointment,
} from "@/app/action/get-upcoming-appointments"

type Action = {
  label: string
  icon: React.ReactNode
  onClick?: () => void
  href?: string
}

const defaultActions: Action[] = [
  {
    label: "Cadastrar paciente",
    icon: <UserPlus size={18} />,
    href: "/dashboard/pacientes/cadastrar-paciente",
  },
  {
    label: "Novo vídeo treino",
    icon: <VideoIcon size={18} />,
    href: "/dashboard/videos/new",
  },
  {
    label: "Registrar novo tratamento",
    icon: <ClipboardPlus size={18} />,
    href: "/dashboard/tratamentos/novo",
  },
]

export default async function DashboardPage() {
  const [metrics, evolutions, monthBirthdays, publishedTestimonials] =
    await Promise.all([
      getMetricsOverview(),
      getRecentPatientsFromEvolutions(),
      getMonthBirthdayPatients(),
      getCountTestimonialsByStatus(),
    ])

  const upcomingAppointmentsResult = await getUpcomingAppointments()
  const appointments: UpcomingAppointment[] = upcomingAppointmentsResult.success
    ? upcomingAppointmentsResult.data
    : []

  const actions = [
    ...defaultActions,
    ...(publishedTestimonials.unpublishedCount > 0
      ? [
          {
            label: `Depoimentos pendentes (${publishedTestimonials.unpublishedCount})`,
            icon: <MessageSquarePlus size={18} />,
            href: "/dashboard/depoimentos",
          },
        ]
      : []),
  ]

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="Visão Geral"
        description="Resumo de pacientes, tratamentos e uma visão geral do seu estabelecimento."
      />
      <div className="space-y-6">
        <MetricsGrid metrics={metrics} />

        <BirthdayPatientsList patients={monthBirthdays} />

        <QuickActions actions={actions} />

        <UpcomingAppointments appointments={appointments} />

        <RecentPatients patients={evolutions} />
      </div>
    </div>
  )
}
