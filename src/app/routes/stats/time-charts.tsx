import { Chart, Coordinate } from "components/ui/chart"
import { timeHelpers } from "utils/time-helpers"

import { TimeStats } from "./get-time-stats"

const transformPoints = (
  stats: Record<string, TimeStats>,
  key: keyof TimeStats,
  transformX: (x: number) => number
) =>
  Object.entries(stats)
    .flatMap(([x, stats]) =>
      !stats[key] ? [] : { x: transformX(Number(x)), y: stats[key] }
    )
    .sort((a, b) => a.x - b.x)
    .map(({ x, y }, index) => ({ x: index, y, actualX: x }))

const getGraphRange = (points: Coordinate[]) => {
  const { min, max } = Chart.utils.getExtremes(points)
  return {
    minY: min.y + (60 - (min.y % 60)) - 120,
    maxY: max.y - (max.y % 60) + 120,
    minX: min.x,
    maxX: max.x,
  }
}

const getTicks = (
  points: ReturnType<typeof transformPoints>,
  tickLabel: (x: number) => string
) => {
  const ticks: Record<number, string> = {}
  points.forEach(({ x, actualX }) => (ticks[x] = tickLabel(actualX)))
  return ticks
}

const timeDotLabel = ({ y }: Coordinate) => timeHelpers.fromMinutes(y)
const hourDotLabel = ({ y }: Coordinate) => `${(y / 60).toFixed(1)}h`

interface TimeChartProps {
  timeStats: Record<string, TimeStats>
  tickLabel?: (x: number) => string
  transformX?: (x: number) => number
}

export const WorkingHoursChart = ({
  timeStats,
  tickLabel = String,
  transformX = x => x,
}: TimeChartProps) => {
  const startPoints = transformPoints(timeStats, "start", transformX)
  const endPoints = transformPoints(timeStats, "end", transformX)
  const ticks = getTicks(startPoints, tickLabel)

  const startRange = getGraphRange(startPoints)
  const endRange = getGraphRange(endPoints)

  const maxX = Math.max(startRange.maxX, endRange.maxX)
  const minY = Math.min(startRange.minY, endRange.minY)
  const maxY = Math.max(startRange.maxY, endRange.maxY)

  return (
    <Chart.Root maxX={maxX} minY={minY} maxY={maxY}>
      <Chart.Caption>Working Hours (avg)</Chart.Caption>

      <Chart.Line points={startPoints} />
      <Chart.Dots points={startPoints} printValue={timeDotLabel} />

      <Chart.Line points={endPoints} />
      <Chart.Dots points={endPoints} printValue={timeDotLabel} />

      <Chart.XAxis color="gentle" position={minY} ticks={ticks} />
      <Chart.Grid gapY={60} />
    </Chart.Root>
  )
}

export const TotalTimeChart = ({
  timeStats,
  tickLabel = String,
  transformX = x => x,
}: TimeChartProps) => {
  const points = transformPoints(timeStats, "total", transformX)
  const ticks = getTicks(points, tickLabel)
  const { maxX, maxY } = getGraphRange(points)

  return (
    <Chart.Root maxX={maxX} minY={0} maxY={maxY}>
      <Chart.Caption>Working Time (avg)</Chart.Caption>
      <Chart.Bars points={points} printValue={hourDotLabel} />

      <Chart.XAxis color="gentle" position={0} ticks={ticks} />
      <Chart.Grid gapY={60} />
    </Chart.Root>
  )
}
