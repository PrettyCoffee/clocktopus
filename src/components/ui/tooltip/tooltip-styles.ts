import { cn } from "utils/cn"
import { surface } from "utils/styles"
import { zIndex } from "utils/z-index"

export const tooltipStyles = cn(
  surface({ look: "overlay", size: "md" }),
  "pointer-events-none overflow-hidden px-3 py-1.5 text-sm",
  zIndex.tooltip
)
