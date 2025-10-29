import { Dispatch } from "react"

import { TimeEntry } from "data/time-entries"
import { cn } from "utils/cn"
import { surface } from "utils/styles"

import { TimeSummary } from "./time-summary"
import { TimeTableEditable } from "./time-table-editable"
import { TimeTableHeader } from "./time-table-header"

interface TimeTableProps {
  title: string
  entries: TimeEntry[]
  hideTotal?: boolean
  locked?: {
    value: boolean
    onChange: Dispatch<boolean>
  }
}

export const TimeTable = ({
  title,
  entries,
  hideTotal,
  locked,
}: TimeTableProps) => (
  <div
    className={cn(
      surface({ look: "card", size: "lg" }),
      "isolate bg-transparent p-0"
    )}
  >
    <TimeTableHeader
      title={title}
      entries={entries}
      hideTotal={hideTotal}
      locked={locked}
    />

    {locked?.value ? (
      <TimeSummary entries={entries} />
    ) : (
      <div className="rounded-b-lg bg-background">
        <TimeTableEditable entries={entries} />
      </div>
    )}
  </div>
)
