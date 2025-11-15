import { cn } from "utils/cn"

import { chartColor, ChartStrokeColor } from "./fragments/chart-color"
import { Coordinate, useChartContext } from "./fragments/chart-context"

const drawStroke = (node: SVGPolylineElement | null) => {
  if (!node) return
  const length = node.getTotalLength()
  node.style.transitionProperty = ""
  node.style.transitionDuration = "0s"
  node.style.strokeDashoffset = String(length)
  node.style.strokeDasharray = String(length)

  window.queueMicrotask(() => {
    node.style.transitionProperty = "stroke-dashoffset"
    node.style.transitionDuration = "0.5s"
    node.style.strokeDashoffset = "0"
  })
}

export interface LineProps extends ChartStrokeColor {
  points: Coordinate[]
}

export const Line = ({ points, color = "priority" }: LineProps) => {
  const { scalePoint } = useChartContext()
  const projectedPoints = points.map(scalePoint)

  return (
    <polyline
      ref={element => {
        drawStroke(element)
      }}
      points={projectedPoints.map(({ x, y }) => `${x},${y}`).join(" ")}
      strokeWidth={1}
      className={cn(
        "ease-out",
        chartColor.stroke({ color }),
        chartColor.fill({ color: "none" })
      )}
    />
  )
}
