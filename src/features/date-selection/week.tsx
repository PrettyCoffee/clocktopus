import { Button } from "components/ui/button"
import { useTrackedDates } from "data/time-entries"
import { cn } from "utils/cn"
import { getLocale } from "utils/get-locale"

import { selectedWeek } from "./selected-week"

export interface WeekProps {
  year: number
  calendarWeek: number
  days: Date[]
  selected?: boolean
}
export const Week = ({ year, calendarWeek, days, selected }: WeekProps) => {
  const trackedDates = useTrackedDates()
  const first = days.find(day => day.getDate() === 1)
  const isFirstOfYear = days[0]!.getMonth() === 0 && days[0]!.getDate() === 1
  const hasTimeEntry = days.some(day =>
    trackedDates.includes(day.toISOString().split("T")[0]!)
  )
  return (
    <div className="relative pl-4">
      {first && (
        <span className="absolute bottom-1 left-1 inline-block origin-left -rotate-90 text-sm text-text-muted">
          {first.toLocaleDateString(getLocale(), { month: "short" })}
        </span>
      )}

      <Button
        size="sm"
        onClick={() => selectedWeek.set({ year, week: calendarWeek, days })}
        className={cn(
          "relative w-full justify-start px-1",
          isFirstOfYear && "justify-end",
          selected && "border border-stroke",
          !hasTimeEntry && "*:opacity-50"
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
                "w-[calc(100%_/_7)] border-current font-mono",
                isFirstOfMonth && "border-b-2 border-l-2 rounded-bl-sm",
                isLastMonth && "border-t-2",
                isNextMonth && "border-b-2",
                weekday === 0 || weekday === 6
                  ? "text-highlight/75"
                  : "text-text/75"
              )}
            >
              {String(date).padStart(2, "0")}
            </span>
          )
        })}
      </Button>
    </div>
  )
}
