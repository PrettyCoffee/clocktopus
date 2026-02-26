import { Dispatch, Fragment, PropsWithChildren, useState } from "react"

import { t } from "@lingui/core/macro"
import { Trans } from "@lingui/react/macro"
import { ClockPlus } from "lucide-react"

import { ContextInfo } from "components/ui/context-info"
import { TimeEntry } from "data/time-entries"
import { useAtom } from "lib/yaasl"
import { cn } from "utils/cn"
import { vstack } from "utils/styles"
import { timeHelpers } from "utils/time-helpers"

import { CategoriesChart } from "./categories-chart"
import { getTimeStats, TimeStats } from "./get-time-stats"
import { filteredStatsEntries } from "./stats-side-route"
import { WorkingHoursChart, TotalTimeChart } from "./time-charts"

const splitEntries = (
  timeEntries: Record<string, TimeEntry[]>,
  getKey: (date: string) => number
) => {
  const result: Record<number, Record<string, TimeEntry[]>> = {}

  Object.entries(timeEntries).forEach(([date, entries]) => {
    const key = getKey(date)
    if (!result[key]) result[key] = {}
    result[key][date] = entries
  })

  return result
}

const getCategoryStats = (timeEntries: Record<string, TimeEntry[]>) => {
  const byCategory: Record<string, number> = {}
  let total = 0

  Object.values(timeEntries)
    .flat()
    .forEach(({ categoryId = "", start, end }) => {
      const duration = timeHelpers.getDuration(start, end) / 60
      total += duration
      byCategory[categoryId] ??= 0
      byCategory[categoryId] += duration
    }, {})

  return { byCategory, total }
}

type StatsByTime = Record<number, TimeStats>

const getYearStats = (timeEntries: Record<string, TimeEntry[]>) => {
  const byYear = splitEntries(timeEntries, date => new Date(date).getFullYear())
  const allStats: StatsByTime = {}

  Object.entries(byYear).forEach(([year, entriesByDate]) => {
    const stats = getTimeStats(entriesByDate)
    if (!stats || stats.total === 0) return
    allStats[Number(year)] = stats
  })

  return allStats
}

const getMonthStats = (timeEntries: Record<string, TimeEntry[]>) => {
  const byMonth = splitEntries(timeEntries, date => new Date(date).getMonth())
  const allStats: StatsByTime = {}

  Object.entries(byMonth).forEach(([month, entriesByDate]) => {
    const stats = getTimeStats(entriesByDate)
    if (!stats || stats.total === 0) return
    allStats[Number(month)] = stats
  })

  return allStats
}

const getDayStats = (timeEntries: Record<string, TimeEntry[]>) => {
  const byWeekday = splitEntries(timeEntries, date => new Date(date).getDay())
  const allStats: StatsByTime = {}

  Object.entries(byWeekday).forEach(([weekday, entriesByDate]) => {
    const stats = getTimeStats(entriesByDate)
    if (!stats || stats.total === 0) return
    allStats[Number(weekday)] = stats
  })

  return allStats
}

const weekdayTick = (value: number) =>
  [
    t`Monday`.slice(0, 2),
    t`Tuesday`.slice(0, 2),
    t`Wednesday`.slice(0, 2),
    t`Thursday`.slice(0, 2),
    t`Friday`.slice(0, 2),
    t`Saturday`.slice(0, 2),
    t`Sunday`.slice(0, 2),
  ][value] ?? "N/A"

const transformWeekday = (x: number) =>
  // start week with monday
  (x + 6) % 7

const monthTick = (value: number) =>
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

type Mode = "weekday" | "month" | "year" | "categories"

const StatsModeHeader = ({
  mode,
  onChange,
}: {
  mode: Mode
  onChange: Dispatch<Mode>
}) => (
  <h2 className="mb-2 text-xl">
    <span className="mr-2 text-text-muted">
      <Trans>Stats by</Trans>
    </span>
    {(["weekday", "month", "year", "categories"] as const).map(
      (value, index) => (
        <Fragment key={value}>
          {index !== 0 && (
            <span className="font-bold text-text-muted"> | </span>
          )}
          <button
            key={value}
            onClick={() => onChange(value)}
            className={cn(
              "cursor-pointer font-bold text-text-gentle uppercase underline-offset-4 hover:text-text hover:underline",
              value === mode && "text-text-priority"
            )}
          >
            {
              {
                weekday: t`weekday`,
                month: t`month`,
                year: t`year`,
                categories: t`categories`,
              }[value]
            }
          </button>
        </Fragment>
      )
    )}
  </h2>
)

const InsufficientStatsData = ({ subject }: { subject: string }) => (
  <div className="max-w-90 text-center">
    <ContextInfo
      animateIcon="rotate"
      icon={ClockPlus}
      label={t`Insufficient data`}
    >
      <Trans>
        You will need to provide more data, to be able to see stats here. (at
        least 2 {subject})
      </Trans>
    </ContextInfo>
  </div>
)

const ChartLayout = ({ children }: PropsWithChildren) => (
  <div
    className={cn(
      vstack({ gap: 8 }),
      "w-full max-w-xl gap-10 *:h-64 *:first:h-64"
    )}
  >
    {children}
  </div>
)

const CategoryStats = ({
  entries,
}: {
  entries: Record<string, TimeEntry[]>
}) => {
  const { byCategory, total } = getCategoryStats(entries)

  if (Object.keys(byCategory).length < 2) {
    return <InsufficientStatsData subject={t`categories`} />
  }

  return (
    <ChartLayout>
      <CategoriesChart stats={byCategory} total={total} />
    </ChartLayout>
  )
}

interface TimeChartsProps {
  entries: Record<string, TimeEntry[]>
  mode: Exclude<Mode, "categories">
}
const TimeCharts = ({ entries, mode }: TimeChartsProps) => {
  const data = {
    weekday: getDayStats,
    month: getMonthStats,
    year: getYearStats,
  }[mode](entries)

  const tick = {
    weekday: weekdayTick,
    month: monthTick,
    year: String,
  }[mode]

  const transform = {
    weekday: transformWeekday,
    month: Number,
    year: Number,
  }[mode]

  const subject = {
    weekday: t`weekdays`,
    month: t`months`,
    year: t`years`,
  }[mode]

  if (Object.values(data).length < 2) {
    return <InsufficientStatsData subject={subject} />
  }

  return (
    <ChartLayout>
      <WorkingHoursChart
        timeStats={data}
        tickLabel={tick}
        transformX={transform}
      />
      <TotalTimeChart
        timeStats={Object.fromEntries(
          Object.entries(data).map(([x, y]) => [tick(transform(Number(x))), y])
        )}
      />
    </ChartLayout>
  )
}

export const StatsRoute = () => {
  const [mode, setMode] = useState<Mode>("weekday")
  const filtered = useAtom(filteredStatsEntries)

  return (
    <div className={cn(vstack({ align: "center" }), "min-h-full px-10 pt-20")}>
      <StatsModeHeader mode={mode} onChange={setMode} />
      <div className="pb-8" />
      {mode === "categories" ? (
        <CategoryStats entries={filtered} />
      ) : (
        <TimeCharts mode={mode} entries={filtered} />
      )}
      <div className="pb-8" />
    </div>
  )
}
