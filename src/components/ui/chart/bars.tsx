import { Fragment } from "react/jsx-runtime"

import { themeData } from "data/theme"
import { useAtom } from "lib/yaasl"
import { cn } from "utils/cn"

import {
  chartColor,
  ChartFillColor,
  ChartStrokeColor,
} from "./fragments/chart-color"
import { Coordinate, useChartContext } from "./fragments/chart-context"
import { Text } from "./fragments/text"
import { createTransition } from "./utils/get-transition"

const { runTransition: runTextTransition } = createTransition({
  initStyles: {
    translate: "0 -16px",
    opacity: "0",
  },
  targetStyles: {
    opacity: "1",
    translate: "0 0",
  },
})

const { runTransition: runBarTransition } = createTransition({
  timingFunction: "bounce",
  initStyles: {
    transformOrigin: "0 100%",
    scale: "1 0",
    opacity: "0",
  },
  targetStyles: {
    transformOrigin: "0 100%",
    scale: "1 1",
    opacity: "1",
  },
})

interface BarsProps {
  points: Coordinate[]
  ground?: number
  barWidth?: number
  strokeColor?: ChartStrokeColor["color"]
  fillColor?: ChartFillColor["color"]
  printValue?: (value: Coordinate) => string
}

export const Bars = ({
  points,
  ground = 8,
  barWidth = 16,
  strokeColor = "none",
  fillColor = "default",
  printValue,
}: BarsProps) => {
  const { radius } = useAtom(themeData)
  const { scalePoint, scaleY } = useChartContext()
  const bars = points.map(point => {
    const top = scalePoint(point)
    const bottom = { x: top.x, y: scaleY(ground) }
    return { top, bottom, value: point }
  })

  return (
    <>
      {bars.map(({ bottom, top, value }, index) => {
        const text = printValue?.(value)
        return (
          <Fragment key={`${top.x}-${top.y}`}>
            <rect
              ref={node => {
                runBarTransition({ node, items: bars.length, index })
              }}
              rx={radius / 3}
              ry={radius / 3}
              x={top.x - barWidth / 2}
              y={top.y}
              width={barWidth}
              height={Math.abs(bottom.y - top.y)}
              strokeWidth={strokeColor === "none" ? 0 : 1}
              className={cn(
                chartColor.stroke({ color: strokeColor }),
                chartColor.fill({ color: fillColor })
              )}
            />
            {text && (
              <Text
                ref={node => {
                  runTextTransition({ node, items: bars.length, index })
                }}
                x={top.x}
                y={top.y - 8}
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
