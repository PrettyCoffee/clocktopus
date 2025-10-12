import { Dispatch, useState } from "react"

import { DateInput } from "components/ui/date-input"
import { Input } from "components/ui/input"
import { TimeInput } from "components/ui/time-input"
import { type TimeEntry } from "data/time-entries"
import { ProjectSelect } from "features/components/project-select"
import { ClassNameProp } from "types/base-props"
import { cn } from "utils/cn"
import { dateHelpers } from "utils/date-helpers"
import { getLocale } from "utils/get-locale"

interface InputProps extends ClassNameProp {
  entry: TimeEntry
  onChange: Dispatch<Partial<TimeEntry>>
}

const Description = ({ entry, className, onChange, ...rest }: InputProps) => (
  <Input
    {...rest}
    type="text"
    placeholder="Description"
    className={cn("flex-1", className)}
    value={entry.description}
    onChange={description => onChange({ description })}
  />
)

const DateComp = ({ entry, onChange, ...rest }: InputProps) => (
  <DateInput
    {...rest}
    locale={getLocale()}
    value={entry.date}
    max={dateHelpers.today()}
    onChange={date => onChange({ date })}
  />
)

const TimeStart = ({ entry, onChange, ...rest }: InputProps) => {
  const [start, setStart] = useState(entry.start)
  return (
    <TimeInput
      {...rest}
      value={start}
      onChange={setStart}
      onBlur={() => onChange({ start })}
      onKeyDown={({ key }) => key === "Enter" && onChange({ start })}
    />
  )
}
const TimeEnd = ({ entry, onChange, ...rest }: InputProps) => {
  const [end, setEnd] = useState(entry.end)
  return (
    <TimeInput
      {...rest}
      value={end}
      onChange={setEnd}
      onBlur={() => onChange({ end })}
      onKeyDown={({ key }) => key === "Enter" && onChange({ end })}
    />
  )
}
const TimeSeparator = () => <span className="mx-2 text-text-gentle">–⁠</span>

const TableProjectSelect = ({ entry, onChange, ...rest }: InputProps) => (
  <ProjectSelect
    {...rest}
    value={entry.projectId ?? ""}
    onChange={project =>
      onChange({ projectId: project === "none" ? undefined : project })
    }
  />
)

export const inputs = {
  Description,
  Date: DateComp,
  TimeStart,
  TimeEnd,
  TimeSeparator,
  Project: TableProjectSelect,
}
