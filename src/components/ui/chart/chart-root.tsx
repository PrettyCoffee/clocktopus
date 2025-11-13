import { PropsWithChildren, useState } from "react"

import { ClassNameProp } from "types/base-props"
import { cn } from "utils/cn"

import { ChartContext, Coordinate } from "./fragments/chart-context"

const normalize = (value: number, min: number, max: number) =>
  (value - min) / (max - min)

const reverseNormalize = (normalized: number, min: number, max: number) =>
  normalized * (max - min) + min

type Padding = number | [number, number] | [number, number, number, number]

const getPadding = (padProp: Padding = 20) => {
  if (typeof padProp === "number") {
    return { top: padProp, right: padProp, bottom: padProp, left: padProp }
  }

  if (padProp.length === 2) {
    return {
      top: padProp[0],
      right: padProp[1],
      bottom: padProp[0],
      left: padProp[1],
    }
  }

  return {
    top: padProp[0],
    right: padProp[1],
    bottom: padProp[2],
    left: padProp[3],
  }
}

interface ChartRootProps extends ClassNameProp {
  minX?: number
  minY?: number
  maxX: number
  maxY: number
  padding?: Padding
}

export const ChartRoot = ({
  padding: padProp,
  minX = 0,
  minY = 0,
  maxX,
  maxY,
  className,
  children,
}: PropsWithChildren<ChartRootProps>) => {
  const padding = getPadding(padProp)
  const [rect, setRect] = useState({ width: 0, height: 0 })

  const scaleX = (x: number) => {
    const normalized = normalize(x, minX, maxX)
    const availableWidth = rect.width - padding.left - padding.right
    return normalized * availableWidth + padding.left
  }
  const reverseScaleX = (scaledX: number) => {
    const availableWidth = rect.width - padding.left - padding.right
    const normalized = (scaledX - padding.left) / availableWidth
    return reverseNormalize(normalized, minX, maxX)
  }
  const scaleY = (y: number) => {
    const normalized = normalize(y, minY, maxY)
    const availableHeight = rect.height - padding.top - padding.bottom
    return (1 - normalized) * availableHeight + padding.top
  }
  const reverseScaleY = (scaledY: number) => {
    const availableHeight = rect.height - padding.top - padding.bottom
    const normalized = 1 - (scaledY - padding.top) / availableHeight
    return reverseNormalize(normalized, minY, maxY)
  }
  const scalePoint = (value: Coordinate): Coordinate => ({
    x: scaleX(value.x),
    y: scaleY(value.y),
  })

  const updateRect = (element: HTMLElement | null) => {
    if (!element) return
    const { height, width } = element.getBoundingClientRect()
    setRect(prev =>
      prev.height === height && prev.width === width ? prev : { height, width }
    )
  }

  return (
    <ChartContext
      value={{
        scaleX,
        scaleY,
        reverseScaleX,
        reverseScaleY,
        scalePoint,
        boundaries: { minX, minY, maxX, maxY },
        rect,
      }}
    >
      <div ref={updateRect} className={cn("relative", className)}>
        <svg viewBox={`0 0 ${rect.width} ${rect.height}`} className="size-full">
          {children}
        </svg>
      </div>
    </ChartContext>
  )
}
