import { Fragment } from "react/jsx-runtime"

import { chartColor, ChartFillColor } from "./fragments/chart-color"
import { Coordinate, useChartContext } from "./fragments/chart-context"
import { Text } from "./fragments/text"

export interface LineProps extends ChartFillColor {
  points: Coordinate[]
  printValue?: (value: Coordinate) => string
}

export const Dots = ({ points, printValue, color = "priority" }: LineProps) => {
  const { scalePoint } = useChartContext()
  const projectedPoints = points.map(point => ({
    ...scalePoint(point),
    value: point,
  }))

  return (
    <>
      {projectedPoints.map(({ x, y, value }) => (
        <Fragment key={`${value.x}-${value.y}`}>
          <circle
            cx={x}
            cy={y}
            r={3}
            strokeWidth={0}
            className={chartColor.fill({ color })}
          />
          {printValue && (
            <Text x={x} y={y - 8} anchor="middle">
              {printValue(value)}
            </Text>
          )}
        </Fragment>
      ))}
    </>
  )
}
