import { Dispatch, PropsWithChildren, useState } from "react"

import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "utils/cn"
import { hstack, vstack } from "utils/styles"
import { today } from "utils/today"

import { Button } from "../button"
import { IconButton } from "../icon-button"
import { Day } from "./utils/day"
import { Month } from "./utils/month"

interface SizeProp {
  size: "sm" | "md"
}

const getSize = (size: SizeProp["size"]) =>
  size === "sm" ? "size-8" : "size-10"

const GridHeaderCell = ({ children, size }: PropsWithChildren<SizeProp>) => (
  <div
    className={cn(
      hstack({ align: "center", justify: "center" }),
      "text-text-gentle",
      getSize(size)
    )}
  >
    {children}
  </div>
)

const GridHeader = ({ size }: SizeProp) => (
  <>
    <GridHeaderCell size={size}>M</GridHeaderCell>
    <GridHeaderCell size={size}>D</GridHeaderCell>
    <GridHeaderCell size={size}>M</GridHeaderCell>
    <GridHeaderCell size={size}>D</GridHeaderCell>
    <GridHeaderCell size={size}>F</GridHeaderCell>
    <GridHeaderCell size={size}>S</GridHeaderCell>
    <GridHeaderCell size={size}>S</GridHeaderCell>
  </>
)

interface GridBodyProps extends SizeProp {
  month: Month
  selected?: string
  onSelectionChange?: Dispatch<string>
  isDisabled: (day: Day) => boolean
}
const GridBody = ({
  size,
  month,
  selected,
  onSelectionChange,
  isDisabled,
}: GridBodyProps) => (
  <>
    {month.days.map(day => (
      <Button
        key={day.toString()}
        size={size}
        onClick={() => onSelectionChange?.(day.toString())}
        disabled={isDisabled(day)}
        className={cn(
          getSize(size),
          day.toString() === selected && "border-stroke-focus border",
          day.meta.isFiller && "text-text-muted",
          day.meta.isToday && "text-highlight"
        )}
      >
        {day.parsed.day}
      </Button>
    ))}
  </>
)

interface ViewSwitchProps extends SizeProp {
  month: Month
  prevMonthDisabled: boolean
  nextMonthDisabled: boolean
  prevMonth: () => void
  nextMonth: () => void
}
const ViewSwitch = ({
  month,
  size,
  nextMonthDisabled,
  prevMonthDisabled,
  nextMonth,
  prevMonth,
}: ViewSwitchProps) => (
  <div className="flex">
    <Button size={size} disabled>
      {month.name}, {month.year}
    </Button>

    <span className="flex-1" />

    <IconButton
      size={size}
      icon={ChevronLeft}
      hideTitle
      title="Previous month"
      onClick={prevMonth}
      disabled={prevMonthDisabled}
    />
    <IconButton
      size={size}
      icon={ChevronRight}
      hideTitle
      title="Next month"
      onClick={nextMonth}
      disabled={nextMonthDisabled}
    />
  </div>
)

const getMonth = (locale: string, date: string) => {
  const [year, month] = date.split("-").map(Number)
  if (!year || !month) {
    throw new Error(
      `Date "${date}" is not valid and cannot be used to create a month.`
    )
  }
  return new Month(locale, year, month)
}

const getDateValue = (date: string) => Number(date.replaceAll("-", ""))

export interface CalendarProps extends Partial<SizeProp> {
  initialView?: string
  selected?: string
  onSelectionChange?: Dispatch<string>
  locale: string
  min?: string
  max?: string
}

export const Calendar = ({
  size = "sm",
  initialView = today(),
  selected,
  onSelectionChange,
  locale,
  max = "2069-12-31",
  min = "1970-01-01",
}: CalendarProps) => {
  const [month, setMonth] = useState(() => getMonth(locale, initialView))

  const nextMonth = month.getRelative(1)
  const prevMonth = month.getRelative(-1)

  const minValue = getDateValue(min)
  const maxValue = getDateValue(max)

  const nextMonthDisabled =
    getDateValue(nextMonth.firstDay.toString()) > maxValue

  const prevMonthDisabled =
    getDateValue(prevMonth.lastDay.toString()) < minValue

  const isDisabled = (day: Day) => {
    const dayValue = getDateValue(day.toString())
    return minValue > dayValue || dayValue > maxValue
  }

  return (
    <div className={cn(vstack({ inline: true }))}>
      <ViewSwitch
        size={size}
        month={month}
        prevMonth={() => setMonth(prevMonth)}
        nextMonth={() => setMonth(nextMonth)}
        nextMonthDisabled={nextMonthDisabled}
        prevMonthDisabled={prevMonthDisabled}
      />
      <div className="inline-grid grid-cols-7">
        <GridHeader size={size} />
        <GridBody
          size={size}
          month={month}
          selected={selected}
          onSelectionChange={onSelectionChange}
          isDisabled={isDisabled}
        />
      </div>
    </div>
  )
}
