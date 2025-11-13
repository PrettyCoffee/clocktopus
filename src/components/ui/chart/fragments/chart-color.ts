import { cva, VariantProps } from "class-variance-authority"

const fill = cva("", {
  variants: {
    color: {
      priority: "fill-chart-priority",
      default: "fill-chart-default",
      gentle: "fill-chart-gentle",
      muted: "fill-chart-muted",
      accent: "fill-chart-accent",
      none: "fill-none",
    },
  },
})

const stroke = cva("", {
  variants: {
    color: {
      priority: "stroke-chart-priority",
      default: "stroke-chart-default",
      gentle: "stroke-chart-gentle",
      muted: "stroke-chart-muted",
      accent: "stroke-chart-accent",
      none: "stroke-none",
    },
  },
})

export type ChartFillColor = VariantProps<typeof fill>
export type ChartStrokeColor = VariantProps<typeof stroke>
export const chartColor = { fill, stroke }
