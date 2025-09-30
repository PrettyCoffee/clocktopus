import { type TimeEntry } from "data/time-entries"
import { ClassNameProp } from "types/base-props"
import { cn } from "utils/cn"
import { timeHelpers } from "utils/time-helpers"

const totalDuration = (entries: TimeEntry[]) =>
  entries.reduce(
    (total, entry) => total + timeHelpers.getDiff(entry.start, entry.end),
    0
  )

export const Duration = ({
  entries = [],
  minutes = totalDuration(entries),
  className,
}: ClassNameProp & { minutes?: number; entries?: TimeEntry[] }) => {
  const duration = timeHelpers.toParsed(timeHelpers.fromMinutes(minutes))
  return (
    <span className={cn("text-base whitespace-nowrap", className)}>
      {duration.hours}
      <span className="mx-0.5 text-text-gentle">:</span>
      {duration.minutes.toString().padStart(2, "0")}
      <span className="mx-0.5 text-text-gentle">h</span>
    </span>
  )
}
