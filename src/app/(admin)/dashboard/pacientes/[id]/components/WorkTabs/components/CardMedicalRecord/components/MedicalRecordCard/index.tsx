type MedicalRecordCardProps = {
  title: string
  icon: React.ReactNode
  content: string
  description?: React.ReactNode
}

const MedicalRecordCard = ({
  title,
  icon,
  content,
  description,
}: MedicalRecordCardProps) => {
  return (
    <div className="rounded-xl border p-5 shadow-sm">
      <div className="flex flex-col items-center justify-center gap-4 lg:flex-row lg:justify-between">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
          {icon}
          {title}
        </h3>
        <div>{description}</div>
      </div>
      <p className="text-muted-foreground rounded-lg text-sm leading-relaxed">
        {content}
      </p>
    </div>
  )
}

export default MedicalRecordCard
