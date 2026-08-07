import { Download, Paperclip } from "lucide-react"

type ExamCardProps = {
  complementaryExams?: string | null
  examUrls?: string[]
}

const ExamRecordCard = ({
  complementaryExams,
  examUrls = [],
}: ExamCardProps) => {
  const hasContent = complementaryExams || examUrls.length > 0

  if (!hasContent) {
    return (
      <div className="rounded-xl border p-5 text-sm text-slate-500 italic shadow-sm">
        Nenhum exame complementado ou laudo anexado.
      </div>
    )
  }

  return (
    <div className="space-y-4 rounded-xl border p-5 shadow-sm">
      {/* Cabeçalho do Card */}
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Paperclip className="h-4 w-4 text-slate-600" />
        <h3>Exames Complementares</h3>
      </div>

      {/* Descrição textual digitada no formulário */}
      {complementaryExams && (
        <p className="text-muted-foreground rounded-lg border p-3 text-sm">
          {complementaryExams}
        </p>
      )}

      {/* Lista de anexos para Download/Visualização */}
      {examUrls.length > 0 && (
        <div className="space-y-2 border-t border-slate-100 pt-2">
          <span className="text-muted-foreground text-xs font-medium">
            Anexos e Laudos ({examUrls.length})
          </span>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {examUrls.map((url, index) => {
              // Extrai uma extensão simples ou nome amigável para o botão
              const isPdf = url.toLowerCase().includes(".pdf")
              const fileName = `Exame_${index + 1}${isPdf ? ".pdf" : ".jpg"}`

              return (
                <div
                  key={url}
                  className="flex w-full items-center justify-between gap-2 rounded-lg border p-2.5 text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Paperclip className="text-muted-foreground h-4 w-4 shrink-0" />
                    <span className="text-muted-foreground truncate font-medium">
                      {fileName}
                    </span>
                  </div>

                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="inline-flex shrink-0 items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1.5 font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Baixar</span>
                  </a>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default ExamRecordCard
