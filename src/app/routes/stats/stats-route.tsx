import { ClockPlus } from "lucide-react"

import { Chart, Coordinate } from "components/ui/chart"
import { ContextInfo } from "components/ui/context-info"
import { projectsData } from "data/projects"
import { timeEntriesData, TimeEntry } from "data/time-entries"
import { useAtomValue } from "lib/yaasl"
import { cn } from "utils/cn"
import { vstack } from "utils/styles"
import { timeHelpers } from "utils/time-helpers"

const getEntries = <TObj extends object>(obj: TObj) =>
  Object.entries(obj) as [keyof TObj | string, TObj[keyof TObj]][]

const splitByWeekdays = (timeEntries: Record<string, TimeEntry[]>) => {
  const byWeekday: Record<number, Record<string, TimeEntry[]>> = {}
  getEntries(timeEntries).forEach(([date, entries]) => {
    const day = new Date(date).getDay()
    if (!byWeekday[day]) byWeekday[day] = {}
    byWeekday[day][date] = entries
  })
  return byWeekday
}

const average = (numbers: number[]) => {
  const sum = numbers.reduce((sum, value) => sum + value, 0)
  return sum / numbers.length
}

interface TimeStats {
  start: number
  end: number
  total: number
}
type TimeStatsByDay = Record<number, TimeStats>

const getProject = (projectId?: string) =>
  projectsData.get().find(project => project.id === projectId)

const getDayStats = (timeEntries: Record<string, TimeEntry[]>) => {
  const byWeekday = splitByWeekdays(timeEntries)
  const allStats: TimeStatsByDay = {}

  getEntries(byWeekday).forEach(([weekday, entriesByDate]) => {
    const total: number[] = []
    const start: number[] = []
    const end: number[] = []

    Object.values(entriesByDate).forEach(entries => {
      const times = entries.flatMap(({ start, end, projectId }) =>
        getProject(projectId)?.isPrivate
          ? []
          : {
              start: timeHelpers.toMinutes(start),
              end: timeHelpers.toMinutes(end),
            }
      )
      if (times.length === 0) return

      const dateStart = Math.min(...times.map(({ start }) => start))
      const dateEnd = Math.max(...times.map(({ end }) => end))

      const totalTime = times.reduce((total, { start, end }) => {
        const duration = end - start
        return total + duration
      }, 0)

      start.push(dateStart)
      end.push(dateEnd)
      total.push(totalTime)
    })

    if (total.length === 0) return

    allStats[Number(weekday)] = {
      start: average(start),
      end: average(end),
      total: average(total),
    }
  })

  return allStats
}

const DayChart = ({
  caption,
  dayStats,
  type,
  printValue,
}: {
  caption: string
  dayStats: TimeStatsByDay
  type: keyof TimeStats
  printValue: (coord: Coordinate) => string
}) => {
  const points = getEntries(dayStats)
    .flatMap(([day, stats]) =>
      !stats[type]
        ? []
        : {
            day: (Number(day) + 6) % 7, // start week with monday
            value: stats[type],
          }
    )
    .sort((a, b) => a.day - b.day)
    .map(({ day, value }, index) => ({ x: index, y: value, day }))

  const { min, max } = Chart.utils.getExtremes(points)

  const minY = min.y + (15 - (min.y % 15)) - 30
  const maxY = max.y - (max.y % 15) + 30

  const ticks = (() => {
    const ticks: Record<number, string> = {}
    points.forEach(
      ({ x, day }) =>
        (ticks[x] = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"][day] ?? "??")
    )
    return ticks
  })()

  return (
    <Chart.Root maxX={max.x} minY={minY} maxY={maxY}>
      <Chart.Caption>{caption}</Chart.Caption>
      <Chart.Line points={points} />
      <Chart.Dots points={points} printValue={printValue} />

      <Chart.XAxis color="gentle" position={minY} ticks={ticks} />
      <Chart.Grid gapY={15} />
    </Chart.Root>
  )
}

export const StatsRoute = () => {
  const timeEntries = useAtomValue(timeEntriesData)
  const dayStats = getDayStats(timeEntries)

  if (Object.values(dayStats).length < 2) {
    return (
      <div className="grid h-full place-items-center">
        <ContextInfo
          animateIcon="rotate"
          icon={ClockPlus}
          label="You need to add more data first, to be able to see stats."
        />
      </div>
    )
  }
  return (
    <div className={cn(vstack({}), "h-full px-10 pt-6")}>
      <h2 className="mb-2 text-xl">Stats by week day</h2>
      <div className="grid auto-rows-[10rem] grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] gap-10 *:h-full">
        <DayChart
          caption="Start time"
          dayStats={dayStats}
          type="start"
          printValue={({ y }) => timeHelpers.fromMinutes(y)}
        />
        <DayChart
          caption="End time"
          dayStats={dayStats}
          type="end"
          printValue={({ y }) => timeHelpers.fromMinutes(y)}
        />
        <DayChart
          caption="Work time"
          dayStats={dayStats}
          type="total"
          printValue={({ y }) => `${(y / 60).toFixed(1)}h`}
        />
      </div>

      <div className="pb-8" />
    </div>
  )
}
