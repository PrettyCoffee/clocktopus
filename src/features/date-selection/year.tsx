import { useMemo } from "react"

import { useAtom } from "lib/yaasl"

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
          key={week.calendarWeek}
          {...week}
          selected={
            selected.year === year && selected.week === week.calendarWeek
          }
        />
      ))}
    </div>
  )
}
