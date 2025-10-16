import { editableDatesData } from "data/editable-dates"
import { useDateEntries } from "data/time-entries"
import { useAtomValue } from "lib/yaasl"
import { cn } from "utils/cn"
import { surface } from "utils/styles"

import { TimeSummary } from "./time-summary"
import { CheckedProps, TimeTableEditable } from "./time-table-editable"
import { TimeTableHeader } from "./time-table-header"

interface TimeTableProps extends CheckedProps {
  date: string
}

export const TimeTable = ({ date, ...rest }: TimeTableProps) => {
  const { entries, atom } = useDateEntries(date)

  const isEditable = !!useAtomValue(editableDatesData)[date]

  return (
    <div
      className={cn(
        surface({ look: "card", size: "lg" }),
        "isolate bg-transparent p-0"
      )}
    >
      <TimeTableHeader date={date} entries={entries} isEditable={isEditable} />

      {isEditable ? (
        <div className="rounded-b-lg bg-background">
          <TimeTableEditable
            date={date}
            entries={entries}
            atom={atom}
            {...rest}
          />
        </div>
      ) : (
        <TimeSummary entries={entries} />
      )}
    </div>
  )
}
