import PageHeader from "@/components/PageHeader"
import {
  getAllTestimonials,
  getCountTestimonials,
} from "@/data/get-testimonials.queries"
import { Prisma } from "@misael1981/physio-database"
import TestimonialsFilters from "./components/TestimonialsFilters"
import { Suspense } from "react"
import PaginationComponent from "@/components/PaginationComponent"
import EmptyData from "@/components/EmptyData"
import { Stethoscope } from "lucide-react"
import TestimonialCard from "./components/TestimonialCard"

interface TestimonialsPageProps {
  searchParams: Promise<{
    isPublished?: string
    search?: string
    page?: string
  }>
}

const ITEMS_PER_PAGE = 10

export default async function TestimonialsPage({
  searchParams,
}: TestimonialsPageProps) {
  const params = await searchParams

  const currentStatus = params.isPublished
  const searchQuery = params.search || ""
  const currentPage = Number(params.page) || 1

  const whereClause: Prisma.TestimonialWhereInput = {}

  // Conversão de String de URL ("true" / "false") para Boolean do Prisma
  if (currentStatus && currentStatus.toUpperCase() !== "TODOS") {
    whereClause.isPublished = currentStatus === "true"
  }

  // Busca ajustada para filtrar pelo nome do depoimento ou nickname do paciente associado
  if (searchQuery) {
    whereClause.OR = [
      { name: { contains: searchQuery, mode: "insensitive" } },
      { patient: { nickname: { contains: searchQuery, mode: "insensitive" } } },
    ]
  }

  const [testimonials, totalTestimonials] = await Promise.all([
    getAllTestimonials({ whereClause, currentPage, ITEMS_PER_PAGE }),
    getCountTestimonials({ whereClause }),
  ])

  const totalPages = Math.ceil(totalTestimonials / ITEMS_PER_PAGE)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gerencie os Depoimentos"
        description="Gerencie os depoimentos compartilhados pelos pacientes, acompanhe suas experiências durante o tratamento e escolha quais relatos poderão ser publicados para inspirar e ajudar outras pessoas em suas jornadas de reabilitação."
      />

      <Suspense
        fallback={
          <div className="h-10 w-full animate-pulse rounded-md bg-slate-100" />
        }
      >
        <TestimonialsFilters />
      </Suspense>

      <div>
        <p className="text-muted-foreground mb-4 text-sm">
          Mostrando {testimonials.length} de {totalTestimonials} depoimentos
          encontrados.
        </p>

        {testimonials.length === 0 ? (
          <EmptyData
            icon={Stethoscope}
            title="Nenhum depoimento encontrado"
            description="Incentive seus pacientes a deixarem um feedback para você."
          />
        ) : (
          <ul className="flex w-full flex-col items-center justify-center gap-4 divide-y">
            {testimonials.map((testimonial) => (
              <li
                key={testimonial.id}
                className="w-full max-w-4xl pt-4 first:pt-0"
              >
                <TestimonialCard testimonial={testimonial} />
              </li>
            ))}
          </ul>
        )}
      </div>

      {totalPages > 1 && (
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
        />
      )}
    </div>
  )
}
