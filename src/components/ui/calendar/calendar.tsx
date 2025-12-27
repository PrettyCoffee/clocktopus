import { Dispatch, PropsWithChildren, SetStateAction, useState } from "react"

import { t } from "@lingui/core/macro"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "utils/cn"
import { dateHelpers } from "utils/date-helpers"
import { hstack, vstack } from "utils/styles"

import { Button } from "../button"
import { IconButton } from "../icon-button"
import { Day } from "./utils/day"
import { focusManager } from "./utils/focus-manager"
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
    <GridHeaderCell size={size}>{t`Monday`[0]}</GridHeaderCell>
    <GridHeaderCell size={size}>{t`Tuesday`[0]}</GridHeaderCell>
    <GridHeaderCell size={size}>{t`Wednesday`[0]}</GridHeaderCell>
    <GridHeaderCell size={size}>{t`Thursday`[0]}</GridHeaderCell>
    <GridHeaderCell size={size}>{t`Friday`[0]}</GridHeaderCell>
    <GridHeaderCell size={size}>{t`Saturday`[0]}</GridHeaderCell>
    <GridHeaderCell size={size}>{t`Sunday`[0]}</GridHeaderCell>
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

const clampMonth = (value: Month, min: Month, max: Month) => {
  if (value.valueOf() < min.valueOf()) return min
  if (value.valueOf() > max.valueOf()) return max
  return value
}

interface ViewSwitchProps extends SizeProp {
  month: Month
  min: string
  max: string
  setMonth: Dispatch<SetStateAction<Month>>
}
const ViewSwitch = ({ month, size, min, max, setMonth }: ViewSwitchProps) => {
  const [magnitude, setMagnitude] = useState<"month" | "year">("month")

  const minMonth = Month.fromDate(month.locale, min)
  const maxMonth = Month.fromDate(month.locale, max)

  const monthDiff = magnitude === "month" ? 1 : 12
  const prev = clampMonth(month.getRelative(-1 * monthDiff), minMonth, maxMonth)
  const next = clampMonth(month.getRelative(monthDiff), minMonth, maxMonth)

  const prevDisabled = month.valueOf() <= minMonth.valueOf()
  const nextDisabled = month.valueOf() >= maxMonth.valueOf()

  const magnitudeCaption = { month: t`Month`, year: t`Year` }[magnitude]

  return (
    <div className="flex">
      <Button
        size={size}
        className="text-text-gentle"
        onClick={() =>
          setMagnitude(prev => (prev === "month" ? "year" : "month"))
        }
      >
        {magnitude === "month" ? (
          <>
            <span className="text-text-priority">{month.name}</span>
            <span className="mr-1">,</span>
            {month.year}
          </>
        ) : (
          <>
            {month.name}
            <span className="mr-1">,</span>
            <span className="text-text-priority">{month.year}</span>
          </>
        )}
      </Button>

      <span className="flex-1" />

      <IconButton
        size={size}
        icon={ChevronLeft}
        hideTitle
        title={t`Previous ${magnitudeCaption}`}
        onClick={() => setMonth(prev)}
        disabled={prevDisabled}
      />
      <IconButton
        size={size}
        icon={ChevronRight}
        hideTitle
        title={t`Next ${magnitudeCaption}`}
        onClick={() => setMonth(next)}
        disabled={nextDisabled}
      />
    </div>
  )
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
  initialView = dateHelpers.today(),
  selected,
  onSelectionChange,
  locale,
  max = "2069-12-31",
  min = "1970-01-01",
}: CalendarProps) => {
  const [month, setMonth] = useState(() => Month.fromDate(locale, initialView))

  const isDisabled = (day: Day) => {
    const dayValue = getDateValue(day.toString())
    return getDateValue(min) > dayValue || dayValue > getDateValue(max)
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- event bubbles up to this element
    <div
      className={cn(vstack({ inline: true }))}
      onKeyDown={event => (event.skipGridNavigation = true)}
    >
      <ViewSwitch
        size={size}
        month={month}
        max={max}
        min={min}
        setMonth={setMonth}
      />
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions
          -- event bubbles up to this element */}
      <div className="inline-grid grid-cols-7" onKeyDown={focusManager}>
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
