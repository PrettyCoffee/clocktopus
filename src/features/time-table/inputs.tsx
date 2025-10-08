import { Dispatch } from "react"

import { DateInput } from "components/ui/date-input"
import { Input } from "components/ui/input"
import { TimeInput } from "components/ui/time-input"
import { type TimeEntry } from "data/time-entries"
import { ProjectSelect } from "features/components/project-select"
import { ClassNameProp } from "types/base-props"
import { cn } from "utils/cn"
import { getLocale } from "utils/get-locale"
import { today } from "utils/today"

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
    max={today()}
    onChange={date => onChange({ date })}
  />
)

const TimeStart = ({ entry, onChange, ...rest }: InputProps) => (
  <TimeInput
    {...rest}
    value={entry.start}
    onChange={start => onChange({ start })}
  />
)
const TimeEnd = ({ entry, onChange, ...rest }: InputProps) => (
  <TimeInput {...rest} value={entry.end} onChange={end => onChange({ end })} />
)
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
