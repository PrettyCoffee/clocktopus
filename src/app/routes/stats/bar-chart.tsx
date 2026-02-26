import { Chart, Coordinate } from "components/ui/chart"

const transformPoints = (stats: Record<string, number>) =>
  Object.entries(stats).map(([x, y], index) => ({ x: index, tick: x, y }))

const getGraphRange = (points: Coordinate[]) => {
  const { max } = Chart.utils.getExtremes(points)

  // For example: maxY = 1800 => scaleBase = 1000
  const scaleBase = Math.pow(10, max.y.toFixed().length - 1)
  const yAxisGap = Math.ceil((Math.ceil(max.y / scaleBase) * scaleBase) / 10)
  const maxY = (Math.ceil(max.y / yAxisGap) + 0.5) * yAxisGap

  return {
    maxY: maxY,
    maxX: max.x,
    yAxisGap,
  }
}

const getPadding = (items: number): [number, number] => {
  const extra = Math.max(0, 12 - items) * 8
  return [24, 24 + extra]
}

const getBarWidth = (items: number) => {
  const extra = Math.max(0, 12 - items) * 4
  return 12 + extra
}

interface BarChartProps {
  title: string
  data: Record<string, number>
  tickLabel: (x: string) => string
  valueLabel: (y: number) => string
  tickRotation?: number
}

export const BarChart = ({
  title,
  data,
  tickLabel,
  valueLabel,
  tickRotation,
}: BarChartProps) => {
  const points = transformPoints(data)
  const { maxX, maxY, yAxisGap } = getGraphRange(points)

  const ticks = Object.fromEntries(
    points.map(({ x, tick }) => [x, tickLabel(tick)] as const)
  )

  return (
    <Chart.Root
      maxX={maxX}
      minY={0}
      maxY={maxY}
      padding={getPadding(points.length)}
      className="[&_svg]:overflow-visible"
    >
      <Chart.Caption>{title}</Chart.Caption>
      <Chart.Bars
        barWidth={getBarWidth(points.length)}
        points={points}
        ground={maxY / 100}
        printValue={({ y }) => valueLabel(y)}
      />

      <Chart.XAxis
        color="gentle"
        position={0}
        ticks={ticks}
        tickRotation={tickRotation}
      />
      <Chart.Grid gapY={yAxisGap} />
    </Chart.Root>
  )
}
