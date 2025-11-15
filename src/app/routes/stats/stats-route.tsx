import { useMemo } from "react"

import { timeEntriesData } from "data/time-entries"
import { useAtomValue } from "lib/yaasl"
import { cn } from "utils/cn"
import { vstack } from "utils/styles"

export const StatsRoute = () => {
  const raw = useAtomValue(timeEntriesData)
  const timeEntries = useMemo(() => Object.values(raw).flat(), [raw])

  return (
    <div className={cn(vstack({}), "h-full px-10 pt-6")}>
      Logged entries: {timeEntries.length}
      <div className="pb-8" />
    </div>
  )
}
