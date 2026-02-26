import { t } from "@lingui/core/macro"

import { getCategoryName } from "features/components/category-name"
import { getLocale } from "utils/get-locale"

import { BarChart } from "./bar-chart"

const aggregate = ({
  stats,
  maxBars,
}: Pick<TimeChartProps, "stats"> & { maxBars: number }) => {
  const all = Object.entries(stats).sort(([, a], [, b]) => b - a)
  if (all.length <= maxBars) return Object.fromEntries(all)

  const visible = all.slice(0, maxBars - 1)
  const rest = all
    .slice(maxBars - 1)
    .reduce(([id, total], [, value]) => [id, total + value], ["others", 0])

  return Object.fromEntries([...visible, rest])
}

const MAX_BARS = 7

interface TimeChartProps {
  stats: Record<string, number>
  total: number
}

export const CategoriesChart = ({ stats, total }: TimeChartProps) => (
  <BarChart
    title={t`Distribution by category`}
    data={aggregate({ stats, maxBars: MAX_BARS })}
    tickRotation={-20}
    tickLabel={categoryId => {
      if (categoryId === "others") {
        const amount = Object.keys(stats).length - MAX_BARS + 1
        return t`Others (${amount})`
      }
      const category = getCategoryName({ categoryId })
      return category?.fullName ?? t`No category`
    }}
    valueLabel={y => {
      const hours = Math.round(y).toLocaleString(getLocale())
      const percent = Math.round((y / total) * 100).toLocaleString(getLocale())
      return `${hours}h (${percent}%)`
    }}
  />
)
