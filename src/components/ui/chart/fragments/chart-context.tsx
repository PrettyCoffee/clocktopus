import { createContext } from "utils/create-context"

export interface Coordinate {
  x: number
  y: number
}

interface Boundaries {
  minX: number
  minY: number
  maxX: number
  maxY: number
}

interface ChartContextValue {
  boundaries: Boundaries
  rect: { height: number; width: number }
  scaleX: (value: number) => number
  scaleY: (value: number) => number
  scalePoint: (value: Coordinate) => Coordinate
  // TODO: Can maybe be removed later
  reverseScaleX: (value: number) => number
  reverseScaleY: (value: number) => number
}

export const ChartContext = createContext<ChartContextValue>("Chart")
export const useChartContext = ChartContext.useRequiredValue
