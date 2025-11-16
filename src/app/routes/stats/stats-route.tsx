import { Dispatch, Fragment, useState } from "react"

import { ClockPlus } from "lucide-react"

import { ContextInfo } from "components/ui/context-info"
import { timeEntriesData, TimeEntry } from "data/time-entries"
import { useAtomValue } from "lib/yaasl"
import { cn } from "utils/cn"
import { vstack } from "utils/styles"
import { timeHelpers } from "utils/time-helpers"

import { getTimeStats, TimeStats } from "./get-time-stats"
import { TimeStatsChart } from "./time-stats-chart"

const getEntries = <TObj extends object>(obj: TObj) =>
  Object.entries(obj) as [keyof TObj | string, TObj[keyof TObj]][]

const splitEntries = (
  timeEntries: Record<string, TimeEntry[]>,
  getKey: (date: string) => number
) => {
  const result: Record<number, Record<string, TimeEntry[]>> = {}

  getEntries(timeEntries).forEach(([date, entries]) => {
    const key = getKey(date)
    if (!result[key]) result[key] = {}
    result[key][date] = entries
  })

  return result
}

type TimeStatsByYear = Record<number, TimeStats>

const getYearStats = (timeEntries: Record<string, TimeEntry[]>) => {
  const byYear = splitEntries(timeEntries, date => new Date(date).getFullYear())
  const allStats: TimeStatsByYear = {}

  getEntries(byYear).forEach(([year, entriesByDate]) => {
    const stats = getTimeStats(entriesByDate)
    if (!stats) return
    allStats[Number(year)] = stats
  })

  return allStats
}

type TimeStatsByMonth = Record<number, TimeStats>

const getMonthStats = (timeEntries: Record<string, TimeEntry[]>) => {
  const byMonth = splitEntries(timeEntries, date => new Date(date).getMonth())
  const allStats: TimeStatsByMonth = {}

  getEntries(byMonth).forEach(([month, entriesByDate]) => {
    const stats = getTimeStats(entriesByDate)
    if (!stats) return
    allStats[Number(month)] = stats
  })

  return allStats
}

type TimeStatsByDay = Record<number, TimeStats>

const getDayStats = (timeEntries: Record<string, TimeEntry[]>) => {
  const byWeekday = splitEntries(timeEntries, date => new Date(date).getDay())
  const allStats: TimeStatsByDay = {}

  getEntries(byWeekday).forEach(([weekday, entriesByDate]) => {
    const stats = getTimeStats(entriesByDate)
    if (!stats) return
    allStats[Number(weekday)] = stats
  })

  return allStats
}

const weekdayTick = (value: number) =>
  ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"][value] ?? "??"

const transformWeekday = (x: number) =>
  // start week with monday
  (x + 6) % 7

const monthTick = (value: number) =>
  [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ][value] ?? "??"

type Mode = "weekday" | "month" | "year"

const StatsModeHeader = ({
  mode,
  onChange,
}: {
  mode: Mode
  onChange: Dispatch<Mode>
}) => (
  <h2 className="mb-2 text-xl">
    <span className="text-text-muted">Stats by </span>
    {(["weekday", "month", "year"] as const).map((value, index) => (
      <Fragment key={value}>
        {index !== 0 && <span className="font-bold text-text-muted"> | </span>}
        <button
          key={value}
          onClick={() => onChange(value)}
          className={cn(
            "cursor-pointer font-bold text-text-gentle uppercase underline-offset-4 hover:text-text hover:underline",
            value === mode && "text-text-priority"
          )}
        >
          {value}
        </button>
      </Fragment>
    ))}
  </h2>
)

const StatsCharts = ({ mode }: { mode: Mode }) => {
  const timeEntries = useAtomValue(timeEntriesData)

  const data = {
    weekday: () => getDayStats(timeEntries),
    month: () => getMonthStats(timeEntries),
    year: () => getYearStats(timeEntries),
  }[mode]()

  const tick = {
    weekday: weekdayTick,
    month: monthTick,
    year: (value: number) => String(value),
  }[mode]

  const transform = {
    weekday: transformWeekday,
    month: (x: number) => x,
    year: (x: number) => x,
  }[mode]

  if (Object.values(data).length < 2) {
    return (
      <div className="max-w-90 text-center">
        <ContextInfo
          animateIcon="rotate"
          icon={ClockPlus}
          label="Insufficient data"
        >
          You will need to add more data first, to be able to see stats here.
          (at least 2 {mode}s)
        </ContextInfo>
      </div>
    )
  }

  return (
    <div className={cn(vstack({ gap: 8 }), "w-full max-w-xl gap-10 *:h-48")}>
      <TimeStatsChart
        caption="Start time"
        timeStats={data}
        type="start"
        dotLabel={({ y }) => timeHelpers.fromMinutes(y)}
        tickLabel={tick}
        transformX={transform}
      />
      <TimeStatsChart
        caption="End time"
        timeStats={data}
        type="end"
        dotLabel={({ y }) => timeHelpers.fromMinutes(y)}
        tickLabel={tick}
        transformX={transform}
      />
      <TimeStatsChart
        caption="Work time"
        timeStats={data}
        type="total"
        dotLabel={({ y }) => `${(y / 60).toFixed(1)}h`}
        tickLabel={tick}
        transformX={transform}
      />
    </div>
  )
}

export const StatsRoute = () => {
  const [mode, setMode] = useState<Mode>("weekday")

  return (
    <div className={cn(vstack({ align: "center" }), "min-h-full px-10 pt-20")}>
      <StatsModeHeader mode={mode} onChange={setMode} />
      <div className="pb-8" />
      <StatsCharts mode={mode} />
      <div className="pb-8" />
    </div>
  )
}
