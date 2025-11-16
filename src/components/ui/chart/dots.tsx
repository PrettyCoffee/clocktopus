import { Fragment } from "react/jsx-runtime"

import { chartColor, ChartFillColor } from "./fragments/chart-color"
import { Coordinate, useChartContext } from "./fragments/chart-context"
import { Text } from "./fragments/text"
import { createTransition } from "./utils/get-transition"

const { runTransition } = createTransition({
  timingFunction: "bounce",
  initStyles: {
    translate: "0 -16px",
    opacity: "0",
  },
  targetStyles: {
    opacity: "1",
    translate: "0 0",
  },
})

interface DotsProps extends ChartFillColor {
  points: Coordinate[]
  printValue?: (value: Coordinate) => string
}

export const Dots = ({ points, printValue, color = "priority" }: DotsProps) => {
  const { scalePoint } = useChartContext()
  const projectedPoints = points.map(point => ({
    ...scalePoint(point),
    value: point,
  }))

  return (
    <>
      {projectedPoints.map(({ x, y, value }, index) => {
        const text = printValue?.(value)
        return (
          <Fragment key={`${value.x}-${value.y}`}>
            <circle
              ref={node => {
                runTransition({ node, index, items: projectedPoints.length })
              }}
              cx={x}
              cy={y}
              r={3}
              strokeWidth={0}
              className={chartColor.fill({ color })}
            />
            {text && (
              <Text
                ref={node => {
                  runTransition({ node, index, items: projectedPoints.length })
                }}
                x={x}
                y={y - 8}
                anchor="middle"
              >
                {text}
              </Text>
            )}
          </Fragment>
        )
      })}
    </>
  )
}
