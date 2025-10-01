import { useMemo } from "react"

import { useAtomValue } from "lib/yaasl"
import { cn } from "utils/cn"
import { hstack } from "utils/styles"

import { selectedWeek } from "./selected-week"
import { Week, WeekProps } from "./week"

const getCalendarWeeks = (year: number) => {
  let current = new Date(year, 0, 1)
  const weeks: WeekProps[] = []

  while (current.getFullYear() === year) {
    if (!weeks[0] || current.getDay() === 1) {
      const lastWeek = weeks.at(-1)
      weeks.push({
        year,
        calendarWeek: (lastWeek?.calendarWeek ?? 0) + 1,
        days: [],
      })
    }

    const week = weeks.at(-1)!
    week.days.push(current)

    const nextDate = new Date(current)
    nextDate.setDate(nextDate.getDate() + 1)
    current = nextDate
  }

  return weeks
}

interface YearProps {
  year: number
}
export const Year = ({ year }: YearProps) => {
  const selected = useAtomValue(selectedWeek)
  const weeks = useMemo(
    () =>
      getCalendarWeeks(year)
        .reverse()
        .filter(({ days }) => days[0]!.valueOf() <= Date.now()),
    [year]
  )

  return (
    <>
      <div
        className={cn(
          "h-8 pl-6 text-sm text-text",
          hstack({ align: "center" })
        )}
      >
        {year}
      </div>
      <div className="grid grid-cols-1">
        {weeks.map(week => (
          <Week
            key={week.calendarWeek}
            {...week}
            selected={
              selected.year === year && selected.week === week.calendarWeek
            }
          />
        ))}
      </div>
    </>
  )
}
