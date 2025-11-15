import { XAxis, YAxis } from "./axis"
import { ChartRoot } from "./chart-root"
import { Dots } from "./dots"
import { Grid } from "./grid"
import { Line } from "./line"

ChartRoot._childrenPriority = [Grid, XAxis, YAxis, Line, Dots]

export const Chart = {
  Root: ChartRoot,
  Grid,
  XAxis,
  YAxis,
  Line,
  Dots,
}
