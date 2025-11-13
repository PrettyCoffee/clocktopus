import { cn } from "utils/cn"

import { chartColor, ChartStrokeColor } from "./fragments/chart-color"
import { Coordinate, useChartContext } from "./fragments/chart-context"

export interface LineProps extends ChartStrokeColor {
  points: Coordinate[]
}

export const Line = ({ points, color = "priority" }: LineProps) => {
  const { scalePoint } = useChartContext()
  const projectedPoints = points.map(scalePoint)

  return (
    <polyline
      className={cn(
        chartColor.stroke({ color }),
        chartColor.fill({ color: "none" })
      )}
      points={projectedPoints.map(({ x, y }) => `${x},${y}`).join(" ")}
      strokeWidth={1}
    />
  )
}
