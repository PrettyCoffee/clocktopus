import { Coordinate } from "../fragments/chart-context"

const getMin = (points: Coordinate[]) => ({
  x: Math.min(...points.map(({ x }) => x)),
  y: Math.min(...points.map(({ y }) => y)),
})

const getMax = (points: Coordinate[]) => ({
  x: Math.max(...points.map(({ x }) => x)),
  y: Math.max(...points.map(({ y }) => y)),
})

export const getExtremes = (points: Coordinate[]) => ({
  min: getMin(points),
  max: getMax(points),
})
