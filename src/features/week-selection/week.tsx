import { t } from "@lingui/core/macro"

import { Button } from "components/ui/button"
import { timeEntriesData } from "data/time-entries"
import { useAtom } from "lib/yaasl"
import { cn } from "utils/cn"
import { dateHelpers } from "utils/date-helpers"

import { selectedWeek } from "./selected-week"

const monthName = (value: number) =>
  [
    t`January`.slice(0, 3),
    t`February`.slice(0, 3),
    t`March`.slice(0, 3),
    t`April`.slice(0, 3),
    t`May`.slice(0, 3),
    t`June`.slice(0, 3),
    t`July`.slice(0, 3),
    t`August`.slice(0, 3),
    t`September`.slice(0, 3),
    t`October`.slice(0, 3),
    t`November`.slice(0, 3),
    t`December`.slice(0, 3),
  ][value] ?? "N/A"

export interface WeekProps {
  year: number
  calendarWeek: number
  days: Date[]
  selected?: boolean
}
export const Week = ({ year, calendarWeek, days, selected }: WeekProps) => {
  const trackedDates = useAtom(timeEntriesData.selectors.getTrackedDates)
  const first = days.find(day => day.getDate() === 1)
  const isFirstOfYear = days[0]!.getMonth() === 0 && days[0]!.getDate() === 1
  const hasTimeEntry = (day: Date) =>
    trackedDates.includes(dateHelpers.stringify(day))

  return (
    <div className="relative pl-4">
      {first?.getFullYear() === year && (
        <span className="absolute bottom-1 left-1.5 inline-block origin-left -rotate-90 text-sm text-text-muted">
          {monthName(first.getMonth())}
        </span>
      )}

      <Button
        size="sm"
        onClick={() => selectedWeek.set({ year, calendarWeek, days })}
        className={cn(
          "relative w-full justify-start border border-transparent px-1",
          isFirstOfYear && "justify-end",
          selected && "border-stroke"
        )}
      >
        {days.map(day => {
          const date = day.getDate()
          const weekday = day.getDay()
          const isFirstOfMonth = date === 1
          const isNextMonth = first && date < 10
          const isLastMonth = first && date > 20
          return (
            <span
              key={date}
              className={cn(
                "w-[calc(100%/7)] border-text-gentle/50 font-mono",
                isFirstOfMonth && "border-b-2 border-l-2 rounded-bl-sm",
                isLastMonth && "border-t-2",
                isNextMonth && "border-b-2",
                weekday === 0 || weekday === 6
                  ? "text-highlight/75"
                  : "text-text-gentle"
              )}
            >
              <span className={cn(!hasTimeEntry(day) && "opacity-50")}>
                {String(date).padStart(2, "0")}
              </span>
            </span>
          )
        })}
      </Button>
    </div>
  )
}
