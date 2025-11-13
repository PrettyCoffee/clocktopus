import { PropsWithChildren, SVGAttributes } from "react"

import { ClassNameProp } from "types/base-props"
import { cn } from "utils/cn"

import { chartColor, ChartFillColor } from "./chart-color"
import { Coordinate } from "./chart-context"

export interface TextProps
  extends PropsWithChildren<ChartFillColor>,
    ClassNameProp {
  x: number
  y: number
  rotate?: number
  anchor?: SVGAttributes<SVGTextElement>["textAnchor"]
  offset?: Partial<Coordinate> | ((position: Coordinate) => Partial<Coordinate>)
}

export const Text = ({
  x,
  y,
  anchor = "middle",
  color = "gentle",
  rotate,
  children,
  className,
}: TextProps) => (
  <text
    x={x}
    y={y}
    textAnchor={anchor}
    transform={!rotate ? undefined : `rotate(${rotate} ${x} ${y})`}
    className={cn(
      chartColor.fill({ color }),
      "fill-text-gentle text-sm",
      className
    )}
  >
    {children}
  </text>
)
