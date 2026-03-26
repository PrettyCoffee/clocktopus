import { type TimeEntry } from "data/time-entries"
import { ClassNameProp } from "types/base-props"
import { cn } from "utils/cn"
import { getLocale } from "utils/get-locale"
import { timeHelpers } from "utils/time-helpers"

const totalDuration = (entries: TimeEntry[]) =>
  entries.reduce(
    (total, entry) => total + timeHelpers.getDuration(entry.start, entry.end),
    0
  )

export const Duration = ({
  entries = [],
  minutes = totalDuration(entries),
  className,
}: ClassNameProp & { minutes?: number; entries?: TimeEntry[] }) => (
  <span className={cn("text-sm whitespace-nowrap", className)}>
    {(minutes / 60).toLocaleString(getLocale(), {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    })}
    <span className="mx-0.5 text-text-muted">h</span>
  </span>
)
