import type { ReactNode } from "react"

type SubCardProps = {
  children: ReactNode
  className?: string
}

const SubCard = ({ children, className }: SubCardProps) => {
  return (
    <div
      className={`group ${className} bg-cream hover:bg-cream/70 min-h-10 w-full rounded-md border border-transparent p-4 font-medium whitespace-nowrap transition-all outline-none dark:border-transparent dark:bg-[#313030] dark:hover:bg-[#313030]/70`}
    >
      {children}
    </div>
  )
}

export default SubCard
