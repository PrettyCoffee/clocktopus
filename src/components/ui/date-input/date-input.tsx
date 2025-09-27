import { Dispatch, useState } from "react"

import { CalendarDays } from "lucide-react"

import { today } from "utils/today"

import { Button } from "../button"
import { Calendar, CalendarProps } from "../calendar"
import { Popover } from "../popover"

const printDate = (date: string, locale: string) => {
  if (date === today()) return "Today"
  if (locale === "iso") return date
  return new Date(date).toLocaleDateString(locale, {
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
  locale: string
}

export const DateInput = ({
  value,
  onChange,
  locale,
  ...props
}: DateInputProps) => {
  const [open, setOpen] = useState(false)
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button
          icon={CalendarDays}
          iconColor="muted"
          className="border border-stroke-gentle"
        >
          {printDate(value, locale)}
        </Button>
      </Popover.Trigger>

      <Popover.Content align="center">
        <Calendar
          locale={locale}
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
