import { Chart, Coordinate } from "components/ui/chart"

import { TimeStats } from "./get-time-stats"

interface TimeStatsChartProps {
  caption: string
  timeStats: Record<string, TimeStats>
  type: keyof TimeStats
  dotLabel: (coord: Coordinate) => string
  tickLabel?: (x: number) => string
  transformX?: (x: number) => number
}
export const TimeStatsChart = ({
  caption,
  timeStats,
  type,
  dotLabel,
  tickLabel = String,
  transformX = x => x,
}: TimeStatsChartProps) => {
  const points = Object.entries(timeStats)
    .flatMap(([x, stats]) =>
      !stats[type] ? [] : { x: transformX(Number(x)), y: stats[type] }
    )
    .sort((a, b) => a.x - b.x)
    .map(({ x, y }, index) => ({ x: index, y, actualX: x }))

  const { min, max } = Chart.utils.getExtremes(points)

  const minY = min.y + (15 - (min.y % 15)) - 30
  const maxY = max.y - (max.y % 15) + 30

  const ticks = (() => {
    const ticks: Record<number, string> = {}
    points.forEach(({ x, actualX }) => (ticks[x] = tickLabel(actualX)))
    return ticks
  })()

  return (
    <Chart.Root maxX={max.x} minY={minY} maxY={maxY}>
      <Chart.Caption>{caption}</Chart.Caption>
      <Chart.Line points={points} />
      <Chart.Dots points={points} printValue={dotLabel} />

      <Chart.XAxis color="gentle" position={minY} ticks={ticks} />
      <Chart.Grid gapY={15} />
    </Chart.Root>
  )
}
