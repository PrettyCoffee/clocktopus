import { Dispatch, useState } from "react"

import { CalendarDays } from "lucide-react"

import { today } from "utils/today"

import { Button } from "../button"
import { Calendar, CalendarProps } from "../calendar"
import { Popover } from "../popover"

const printDate = (date: string) => {
  if (date === today()) return "Today"
  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
}

interface DateInputProps
  extends Omit<
    CalendarProps,
    "selected" | "initialView" | "onSelectionChange"
  > {
  value: string
  onChange: Dispatch<string>
}

export const DateInput = ({ value, onChange, ...props }: DateInputProps) => {
  const [open, setOpen] = useState(false)
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button
          icon={CalendarDays}
          iconColor="muted"
          className="border border-stroke-gentle"
        >
          {printDate(value)}
        </Button>
      </Popover.Trigger>

      <Popover.Content align="center">
        <Calendar
          selected={value}
          initialView={value}
          onSelectionChange={value => {
            onChange(value)
            setOpen(false)
          }}
          {...props}
        />
      </Popover.Content>
    </Popover.Root>
  )
}
