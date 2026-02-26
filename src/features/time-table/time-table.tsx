import { Dispatch, useState } from "react"

import { TimeEntry } from "data/time-entries"
import { Alert } from "types/base-props"
import { cn } from "utils/cn"
import { surface } from "utils/styles"

import { TimeSummary } from "./time-summary"
import { TimeTableEditable } from "./time-table-editable"
import { TimeTableHeader } from "./time-table-header"
import { TrackedTimeline } from "./tracked-timeline"

interface TimeTableProps {
  title: string
  entries: TimeEntry[]
  showTotal?: boolean
  stickyHeader?: `top-${number}`
  alert?: Alert
  showTimeline?: boolean
  locked?: {
    value: boolean
    onChange: Dispatch<boolean>
  }
}

export const TimeTable = ({
  title,
  entries,
  showTotal,
  stickyHeader,
  locked,
  alert,
  showTimeline,
}: TimeTableProps) => {
  const [hoveredTimeline, setHoveredTimeline] = useState<number | undefined>(
    undefined
  )

  return (
    <div
      className={cn(
        surface({ look: "card", size: "lg" }),
        "isolate bg-transparent p-0"
      )}
    >
      <TimeTableHeader
        title={title}
        entries={entries}
        showTotal={showTotal}
        stickyHeader={stickyHeader}
        locked={locked}
        alert={alert}
      />

      {locked?.value ? (
        <TimeSummary entries={entries} />
      ) : (
        <div className="relative rounded-b-lg bg-background">
          <TimeTableEditable entries={entries} highlighted={hoveredTimeline} />
          {showTimeline && (
            <TrackedTimeline entries={entries} onHover={setHoveredTimeline} />
          )}
        </div>
      )}
    </div>
  )
}
