import { useMemo } from "react"

import { useAtom } from "lib/yaasl"

import { getWeek, selectedWeek } from "./selected-week"
import { Week, WeekProps } from "./week"

const getCalendarWeeks = (year: number) => {
  let nextDate = new Date(year, 0, 1)
  const weeks: WeekProps[] = []

  while (nextDate.getFullYear() === year) {
    const week = getWeek(nextDate)
    weeks.push(week)

    const currentEndDate = week.days.at(-1)
    nextDate = new Date(currentEndDate ?? nextDate)
    nextDate.setDate(nextDate.getDate() + 1)

    if (weeks.length >= 60) {
      return weeks
    }
  }

  return weeks
}

const now = Date.now()

interface YearProps {
  year: number
}
export const Year = ({ year }: YearProps) => {
  const selected = useAtom(selectedWeek)
  const weeks = useMemo(
    () =>
      getCalendarWeeks(year)
        .reverse()
        .filter(({ days }) => days[0]!.valueOf() <= now),
    [year]
  )

  return (
    <div className="grid grid-cols-1">
      {weeks.map(week => (
        <Week
          key={`${week.year}-${week.calendarWeek}`}
          {...week}
          year={year}
          selected={
            selected.year === week.year &&
            selected.calendarWeek === week.calendarWeek
          }
        />
      ))}
    </div>
  )
}
