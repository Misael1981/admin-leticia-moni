"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChargeStatus } from "@/constants/enums"
import { CHARGE_STATUS_OPTIONS } from "@/constants/options"

type SelectChargeStatusProps = {
  status: ChargeStatus | undefined
}

const SelectChargeStatus = ({ status }: SelectChargeStatusProps) => {
  console.log("Como vem o status: ", status)
  return (
    <Select value={status}>
      <SelectTrigger className="w-full max-w-sm">
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        {CHARGE_STATUS_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default SelectChargeStatus
