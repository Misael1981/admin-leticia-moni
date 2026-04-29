type PageHeaderProps = {
  title: string
  description?: string
  children?: React.ReactNode // pra botões ou ações
}

const PageHeader = ({ title, description, children }: PageHeaderProps) => {
  return (
    <section className="flex flex-col gap-4 border-b p-4 md:flex-row md:items-center md:justify-between lg:p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>

        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
      </div>

      {children && <div className="flex items-center gap-2">{children}</div>}
    </section>
  )
}

export default PageHeader
