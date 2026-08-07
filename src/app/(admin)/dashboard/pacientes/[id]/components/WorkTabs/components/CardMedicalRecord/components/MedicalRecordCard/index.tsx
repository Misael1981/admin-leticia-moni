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
  const sanitizedContent = content.replace(/&nbsp;/g, " ")

  return (
    <div className="w-full max-w-full overflow-hidden rounded-xl border p-5 shadow-sm">
      <div className="flex flex-col items-center justify-center gap-4 lg:flex-row lg:justify-between">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
          {icon}
          {title}
        </h3>
        <div>{description}</div>
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        className="mt-2 w-full max-w-full text-sm leading-relaxed wrap-anywhere [&_p]:mb-3 [&_p]:last:mb-0"
      />
    </div>
  )
}

export default MedicalRecordCard
