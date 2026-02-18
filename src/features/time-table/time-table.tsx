import { Dispatch } from "react"

import { TimeEntry } from "data/time-entries"
import { Alert } from "types/base-props"
import { cn } from "utils/cn"
import { surface } from "utils/styles"

import { TimeSummary } from "./time-summary"
import { TimeTableEditable } from "./time-table-editable"
import { TimeTableHeader } from "./time-table-header"

interface TimeTableProps {
  title: string
  entries: TimeEntry[]
  showTotal?: boolean
  stickyHeader?: `top-${number}`
  alert?: Alert
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
      showTotal={showTotal}
      stickyHeader={stickyHeader}
      locked={locked}
      alert={alert}
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
