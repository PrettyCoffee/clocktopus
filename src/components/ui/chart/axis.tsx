import { chartColor } from "./fragments/chart-color"
import { useChartContext } from "./fragments/chart-context"
import { Text, TextProps } from "./fragments/text"
import { LineProps } from "./line"

interface AxisProps {
  axis: "x" | "y"
  position?: number
  color?: LineProps["color"]
  name?: string
  ticks?: Record<number, string> | number[]
}

const getTicks = (ticks: AxisProps["ticks"]) => {
  if (!ticks) return []
  if (Array.isArray(ticks)) {
    return ticks
      .map(value => ({ value, label: value.toString() }))
      .toSorted((a, b) => a.value - b.value)
  }
  return Object.entries(ticks)
    .map(([value, label]) => ({
      value: Number(value),
      label,
    }))
    .toSorted((a, b) => a.value - b.value)
}

interface TickProps {
  axis: "x" | "y"
  axisPosition: number
  label: string
  value: number
}
const Tick = ({ axisPosition, value, label, axis }: TickProps) => {
  const { scaleX, scaleY } = useChartContext()
  const point =
    axis === "x"
      ? { x: scaleX(value), y: scaleY(axisPosition) }
      : { x: scaleX(axisPosition), y: scaleY(value) }

  const props: TextProps =
    axis === "x"
      ? {
          x: point.x,
          y: point.y + 16,
          anchor: "middle",
        }
      : {
          x: point.x - 8,
          y: point.y + 4,
          anchor: "end",
        }

  const tickLine =
    axis === "x"
      ? {
          x1: point.x,
          y1: point.y + 3,
          x2: point.x,
          y2: point.y - 3,
        }
      : {
          x1: point.x + 3,
          y1: point.y,
          x2: point.x - 3,
          y2: point.y,
        }

  return (
    <>
      <line
        {...tickLine}
        strokeWidth={1}
        className={chartColor.stroke({ color: "gentle" })}
      />
      <Text {...props}>{label}</Text>
    </>
  )
}

const Axis = ({
  axis,
  name,
  position = 0,
  color = "muted",
  ticks: ticksProp,
}: AxisProps) => {
  const ticks = getTicks(ticksProp)
  const { rect, scaleX, scaleY } = useChartContext()

  const props =
    axis === "x"
      ? { x1: 0, x2: rect.width, y1: scaleY(position), y2: scaleY(position) }
      : { y1: 0, y2: rect.height, x1: scaleX(position), x2: scaleX(position) }

  const textProps =
    axis === "x"
      ? {
          x: rect.width,
          y: scaleY(position) + 16,
        }
      : {
          x: scaleX(position) - 6,
          y: 0,
          rotate: -90,
        }

  return (
    <>
      <line
        {...props}
        strokeWidth={1}
        className={chartColor.stroke({ color })}
      />

      {ticks.map(({ value, label }) => (
        <Tick
          key={label + value}
          label={label}
          value={value}
          axis={axis}
          axisPosition={position}
        />
      ))}

      {name && (
        <Text {...textProps} anchor="end">
          {name}
        </Text>
      )}
    </>
  )
}

export const XAxis = (props: Omit<AxisProps, "axis">) => (
  <Axis {...props} axis="x" />
)

export const YAxis = (props: Omit<AxisProps, "axis">) => (
  <Axis {...props} axis="y" />
)
