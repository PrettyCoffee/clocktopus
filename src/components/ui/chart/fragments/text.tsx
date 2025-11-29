import { PropsWithChildren, SVGAttributes } from "react"

import { ClassNameProp, RefProp } from "types/base-props"
import { cn } from "utils/cn"

import { chartColor, ChartFillColor } from "./chart-color"

export interface TextProps
  extends
    PropsWithChildren<ChartFillColor>,
    ClassNameProp,
    RefProp<SVGTextElement> {
  x: number
  y: number
  rotate?: number
  anchor?: SVGAttributes<SVGTextElement>["textAnchor"]
}

export const Text = ({
  ref,
  x,
  y,
  anchor = "middle",
  color = "gentle",
  rotate,
  children,
  className,
}: TextProps) => (
  <text
    ref={ref}
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
