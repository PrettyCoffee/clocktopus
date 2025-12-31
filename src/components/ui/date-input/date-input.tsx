import { Dispatch, useState } from "react"

import { t } from "@lingui/core/macro"
import { CalendarDays } from "lucide-react"

import { dateHelpers } from "utils/date-helpers"

import { Button } from "../button"
import { Calendar, CalendarProps } from "../calendar"
import { Popover } from "../popover"

const printDate = (date: string, locale: string) => {
  if (date === dateHelpers.today()) return t`Today`
  if (locale === "iso") return date
  return new Date(date).toLocaleDateString(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
}

interface DateInputProps extends Omit<
  CalendarProps,
  "selected" | "initialView" | "onSelectionChange"
> {
  caption?: string
  value?: string
  onChange: Dispatch<string>
  locale: string
}

export const DateInput = ({
  value = dateHelpers.today(),
  onChange,
  locale,
  caption,
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
          {caption ?? printDate(value, locale)}
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
