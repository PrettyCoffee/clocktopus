import { cn } from "utils/cn"

import { chartColor, ChartStrokeColor } from "./fragments/chart-color"
import { Coordinate, useChartContext } from "./fragments/chart-context"
import { createTransition } from "./utils/get-transition"

const { runTransition } = createTransition<SVGPolylineElement>({
  initStyles: node => ({
    strokeDashoffset: String(node.getTotalLength()),
    strokeDasharray: String(node.getTotalLength()),
    opacity: "0",
  }),
  targetStyles: {
    opacity: "1",
    strokeDashoffset: "0",
  },
})

export interface LineProps extends ChartStrokeColor {
  points: Coordinate[]
}

export const Line = ({ points, color = "priority" }: LineProps) => {
  const { scalePoint } = useChartContext()
  const projectedPoints = points.map(scalePoint)

  return (
    <polyline
      ref={node => {
        runTransition({ node })
      }}
      points={projectedPoints.map(({ x, y }) => `${x},${y}`).join(" ")}
      strokeWidth={1}
      className={cn(
        chartColor.stroke({ color }),
        chartColor.fill({ color: "none" })
      )}
    />
  )
}
