import { Dispatch } from "react"

import { DateInput } from "components/ui/date-input"
import { Input } from "components/ui/input"
import { TimeInput } from "components/ui/time-input"
import { type TimeEntry } from "data/time-entries"
import { ClassNameProp } from "types/base-props"
import { cn } from "utils/cn"
import { hstack } from "utils/styles"
import { today } from "utils/today"

interface InputProps extends ClassNameProp {
  entry: TimeEntry
  onChange: Dispatch<Partial<TimeEntry>>
}

const Description = ({ entry, className, onChange }: InputProps) => (
  <Input
    type="text"
    placeholder="Description"
    className={cn("flex-1", className)}
    value={entry.description}
    onChange={description => onChange({ description })}
  />
)

const DateComp = ({ entry, onChange }: InputProps) => (
  <DateInput
    value={entry.date}
    max={today()}
    onChange={date => onChange({ date })}
  />
)

const TimeRange = ({ entry, onChange }: InputProps) => (
  <div className={hstack({ align: "center" })}>
    <TimeInput value={entry.start} onChange={start => onChange({ start })} />
    <span className="mx-1 text-text-gentle">–⁠</span>
    <TimeInput value={entry.end} onChange={end => onChange({ end })} />
  </div>
)

export const inputs = {
  Description,
  Date: DateComp,
  TimeRange,
}
