import { useEffect, useMemo, useRef } from "react"

import { t } from "@lingui/core/macro"
import { Trans } from "@lingui/react/macro"

import { TitleTooltip } from "components/ui/tooltip"
import { ScrollArea } from "components/utility/scroll-area"
import { timeEntriesData, TimeEntry } from "data/time-entries"
import { getCategoryName } from "features/components/category-name"
import { selectedWeek, WeekCarousel } from "features/week-selection"
import { useAtom } from "lib/yaasl"
import { cn } from "utils/cn"
import { createRange } from "utils/create-range"
import { dateHelpers } from "utils/date-helpers"
import { getLanguage, getLocale } from "utils/get-locale"
import { colored, hstack } from "utils/styles"
import { timeHelpers } from "utils/time-helpers"

const remToPx = (rem: number) =>
  rem * Number.parseFloat(getComputedStyle(document.documentElement).fontSize)

const pxToRem = (px: number) =>
  px / Number.parseFloat(getComputedStyle(document.documentElement).fontSize)

const getYPos = (hours: number | string) => {
  if (typeof hours === "string") {
    hours = timeHelpers.toMinutes(hours) / 60
  }

  const rem = hours * 4
  const px = remToPx(rem)
  return { rem: `${rem}rem`, px }
}

const formatDate = (date: string) =>
  getLocale() === "iso"
    ? date
    : new Date(date).toLocaleDateString(getLocale(), {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })

const getDayName = (date: string) =>
  new Date(date).toLocaleDateString(getLanguage(), {
    weekday: "long",
  })

const CalendarHeader = ({ dates }: { dates: string[] }) => (
  <div className={cn(hstack(), "pb-4 pl-8")}>
    {dates.map(date => (
      <div key={date} className="grid flex-1 place-content-center text-center">
        <span className="mx-2 truncate">{getDayName(date)}</span>
        <br />
        <span className="mx-2 truncate text-xs text-text-muted">
          {formatDate(date)}
        </span>
      </div>
    ))}
  </div>
)

const TimeGrid = () => (
  <>
    {createRange(0, 24 * 2 + 1, 0.5).map(value => (
      <span
        key={value}
        className={cn(
          "absolute right-0 left-6 block h-px bg-background select-none",
          "*:-translate-y-1/2 first-of-type:*:-translate-y-0.5 last-of-type:*:-translate-y-3"
        )}
        style={{ top: getYPos(value).rem }}
      >
        {value % 1 === 0 && (
          <span className="absolute top-0 -left-6 font-mono text-xs text-text-muted">
            {String(value).padStart(2, "0")}
          </span>
        )}
      </span>
    ))}
  </>
)

const DayColumn = ({
  entries,
  getDelay,
}: {
  entries: TimeEntry[]
  getDelay: (startTime: string) => number
}) => (
  <div className="relative h-[calc(24*4rem)] flex-1 border-r border-stroke-gentle first-of-type:border-l">
    {entries.length === 0 && (
      <div className="sticky inset-y-0 top-1/2 -translate-y-1/2 text-center font-bold text-text-muted">
        <Trans>No entries</Trans>
      </div>
    )}
    {entries.map(({ id, start, end, categoryId }) => {
      const startH = timeHelpers.toMinutes(start) / 60
      const endH = timeHelpers.toMinutes(end) / 60
      const category = getCategoryName({ categoryId })

      const height = pxToRem(getYPos(endH).px - getYPos(startH).px)
      const showCategory = height >= 2
      return (
        <div
          key={id}
          className={cn(
            "absolute inset-x-1 p-0.5",
            "transition-opacity duration-500 starting:opacity-0"
          )}
          style={{
            top: getYPos(startH).rem,
            height: `${height}rem`,
            transitionDelay: getDelay(start) + "ms",
          }}
        >
          {showCategory ? (
            <span className="absolute top-1.5 right-2 left-2 truncate text-sm font-bold text-text-invert">
              {category?.fullName || t`No category`}
            </span>
          ) : (
            <TitleTooltip title={category?.fullName || t`No category`}>
              <span className="absolute inset-0" />
            </TitleTooltip>
          )}
          <div
            className={cn(
              "size-full rounded-sm",
              colored({ type: "text", color: category?.group?.color }),
              "bg-current/50 [:hover>&]:bg-current/75"
            )}
          />
        </div>
      )
    })}
  </div>
)

export const CalendarRoute = () => {
  const selected = useAtom(selectedWeek)
  const allEntries = useAtom(timeEntriesData)
  const days = useMemo(() => {
    const hasEntries = (date?: Date) => {
      if (!date) return false
      return (allEntries[dateHelpers.stringify(date)] ?? []).length > 0
    }
    // only show saturday / sunday when one of them has entries
    const showWeekend =
      hasEntries(selected.days[5]) || hasEntries(selected.days[6])

    return selected.days.flatMap((date, index) => {
      const dateString = dateHelpers.stringify(date)
      const entries = (allEntries[dateString] ?? []).toSorted(
        (a, b) =>
          timeHelpers.toMinutes(a.start) - timeHelpers.toMinutes(b.start)
      )
      if (index > 4 && !showWeekend) return []
      return { date: dateString, entries }
    })
  }, [allEntries, selected.days])

  const scrollRef = useRef<HTMLDivElement>(null)
  const earliestTime = Math.min(
    ...days
      .flatMap(days => days.entries)
      .map(entry => timeHelpers.toMinutes(entry.start) / 60)
  )
  const firstVisibleHour = Math.floor(earliestTime)
  useEffect(() => {
    scrollRef.current?.scroll({
      top: getYPos(firstVisibleHour - 0.25).px,
      behavior: "instant",
    })
  }, [selected, firstVisibleHour])

  return (
    <div
      key={`${selected.year}-${selected.calendarWeek}`}
      className="flex h-full flex-col px-10"
    >
      <div
        className={cn(hstack({ align: "center", justify: "center" }), "py-4")}
      >
        <WeekCarousel />
      </div>

      <CalendarHeader dates={days.map(day => day.date)} />
      <ScrollArea className="flex-1" ref={scrollRef}>
        <div
          className={cn(
            hstack({ gap: 0, justify: "stretch", align: "stretch" }),
            "relative pl-8"
          )}
        >
          <TimeGrid />

          {days.map((day, columnIndex) => (
            <DayColumn
              key={day.date}
              entries={day.entries}
              getDelay={start => {
                const startHour = timeHelpers.toMinutes(start) / 60
                return (columnIndex * 2 + (startHour - firstVisibleHour)) * 10
              }}
            />
          ))}
        </div>
      </ScrollArea>

      <div className="pb-10" />
    </div>
  )
}
