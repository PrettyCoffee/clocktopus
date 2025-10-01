import { Button } from "components/ui/button"
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
  const first = days.find(day => day.getDate() === 1)
  const isFirstOfYear = days[0]!.getMonth() === 0 && days[0]!.getDate() === 1
  return (
    <div className="relative pl-4">
      <span className="absolute -bottom-0.25 left-1 inline-block origin-left -rotate-90 text-sm text-text-muted">
        {first && (
          <>{first.toLocaleDateString(getLocale(), { month: "short" })}</>
        )}
      </span>

      <Button
        size="sm"
        onClick={() => selectedWeek.set({ year, week: calendarWeek, days })}
        className={cn(
          "relative w-full justify-start px-1",
          isFirstOfYear && "justify-end",
          selected && "border border-stroke"
        )}
      >
        {days.map(day => {
          const date = day.getDate()
          const weekday = day.getDay()
          return (
            <span
              key={date}
              className={cn(
                "w-[calc(100%_/_7)] border-l-2 border-transparent font-mono",
                date === 1
                  ? "text-text/75 border-stroke"
                  : weekday === 0 || weekday === 6
                    ? "text-highlight/50"
                    : "text-text-priority/50"
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
