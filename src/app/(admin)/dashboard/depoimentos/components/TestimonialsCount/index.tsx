import { Badge } from "@/components/ui/badge"

type TestimonialsCountProps = {
  publishedTestimonials: {
    publishedCount: number
    unpublishedCount: number
  }
}

const TestimonialsCount = ({
  publishedTestimonials,
}: TestimonialsCountProps) => {
  return (
    <section className="space-y-2">
      <div>
        {publishedTestimonials.publishedCount === 0 ? (
          <span className="text-sm text-red-600 dark:text-red-400">
            Não há nenhum depoimento publicado
          </span>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-sm text-green-600 dark:text-green-400">
              Depoimentos publicados
            </span>

            <Badge
              variant="outline"
              className="gap-1 border-green-500 text-green-600 dark:text-green-400"
            >
              {publishedTestimonials.publishedCount}
            </Badge>
          </div>
        )}
      </div>

      <div>
        {publishedTestimonials.unpublishedCount && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-amber-600 dark:text-amber-400">
              Depoimentos esperando moderação
            </span>

            <Badge
              variant="outline"
              className="gap-1 border-amber-500 text-amber-600 dark:text-amber-400"
            >
              {publishedTestimonials.unpublishedCount}
            </Badge>
          </div>
        )}
      </div>
    </section>
  )
}

export default TestimonialsCount
