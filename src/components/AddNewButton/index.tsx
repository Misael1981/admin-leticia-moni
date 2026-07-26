import Link from "next/link"
import { buttonVariants } from "../ui/button"
import { ComponentType } from "react"

type IconProps = {
  className?: string
}

type AddNewButtonProps = {
  icon: ComponentType<IconProps>
  url: string
  label: string
}

const AddNewButton = ({ icon: Icon, url, label }: AddNewButtonProps) => {
  return (
    <div className="flex w-full justify-end">
      <Link href={url} className={buttonVariants({ variant: "default" })}>
        <Icon className="mr-2 h-4 w-4" />
        {label}
      </Link>
    </div>
  )
}

export default AddNewButton
