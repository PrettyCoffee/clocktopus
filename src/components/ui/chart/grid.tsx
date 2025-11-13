import { chartColor } from "./fragments/chart-color"
import { useChartContext } from "./fragments/chart-context"

const getLines = (gap: number | undefined, min: number, max: number) => {
  if (!gap || gap > max - min) return []

  let prev = max - (max % gap)
  const lines = [prev]
  while ((prev -= gap) >= min) {
    lines.push(prev)
  }

  return lines
}

interface GridProps {
  gapX?: number
  gapY?: number
}

export const Grid = ({ gapX, gapY }: GridProps) => {
  const { rect, boundaries, scaleX, scaleY } = useChartContext()

  const xLines = getLines(gapX, boundaries.minX, boundaries.maxX).map(x => ({
    x1: scaleX(x),
    x2: scaleX(x),
    y1: 0,
    y2: rect.height,
  }))
  const yLines = getLines(gapY, boundaries.minY, boundaries.maxY).map(y => ({
    y1: scaleY(y),
    y2: scaleY(y),
    x1: 0,
    x2: rect.width,
  }))

  return (
    <>
      {[...xLines, ...yLines].map(coords => (
        <line
          key={`${coords.x1},${coords.y1},${coords.x2},${coords.y2}`}
          {...coords}
          strokeWidth={1}
          className={chartColor.stroke({ color: "muted" })}
        />
      ))}
    </>
  )
}
