import { Dispatch } from "react"

import { Trash } from "lucide-react"

import { IconButton } from "components/ui/icon-button"
import { Input } from "components/ui/input"
import { TimeInput } from "components/ui/time-input"
import { getDateAtom, useDateEntries, type TimeEntry } from "data/time-entries"
import { cn } from "utils/cn"
import { getLocale } from "utils/get-locale"
import { hstack, surface } from "utils/styles"

const today = () => new Date().toISOString().split("T")[0]!

const getTimeDiff = (startTime: string, endTime: string) => {
  const start = startTime.split(":").map(Number) as [number, number]
  const end = endTime.split(":").map(Number) as [number, number]

  const startMinutes = start[0] * 60 + start[1]
  const endMinutes = end[0] * 60 + end[1]
  const minutesDiff =
    startMinutes > endMinutes
      ? endMinutes + 24 * 60 - startMinutes
      : endMinutes - startMinutes

  return minutesDiff
}

const minutesToTime = (minutesDiff: number) => {
  const minutes = minutesDiff % 60
  const hours = (minutesDiff - minutes) / 60
  return {
    hours: hours.toString(),
    minutes: minutes.toString().padStart(2, "0"),
  }
}

const TimeEntryInputs = ({
  entry,
  onChange,
}: {
  entry: TimeEntry
  onChange: Dispatch<Partial<TimeEntry>>
}) => {
  const duration = minutesToTime(getTimeDiff(entry.start, entry.end))
  return (
    <>
      <Input
        type="text"
        placeholder="Description"
        className="flex-1"
        value={entry.description}
        onChange={description => onChange({ description })}
      />
      <Input
        type="date"
        value={entry.date}
        max={today()}
        onChange={date => onChange({ date })}
      />
      <div className={hstack({ align: "center" })}>
        <TimeInput
          value={entry.start}
          onChange={start => onChange({ start })}
        />
        <span className="mx-1 text-text-gentle">–⁠</span>
        <TimeInput value={entry.end} onChange={end => onChange({ end })} />
      </div>
      <div
        className={cn(
          hstack({ justify: "center", align: "center" }),
          "h-10 w-15 text-center text-base"
        )}
      >
        {duration.hours}
        <span className="mx-0.5 text-text-gentle">:</span>
        {duration.minutes}
        <span className="mx-0.5 text-text-gentle">h</span>
      </div>
    </>
  )
}

const totalDuration = (entries: TimeEntry[]) => {
  const minutes = entries.reduce(
    (total, entry) => total + getTimeDiff(entry.start, entry.end),
    0
  )
  return minutesToTime(minutes)
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString(getLocale(), {
    day: "2-digit",
    month: "short",
    weekday: "short",
  })

const TimeTableHeader = ({
  date,
  entries,
}: {
  date: string
  entries: TimeEntry[]
}) => {
  const total = totalDuration(entries)

  return (
    <div
      className={cn(
        surface({ look: "card", size: "lg" }),
        hstack({ align: "center" }),
        "h-10 rounded-b-none border-b-0 bg-background-page"
      )}
    >
      <h2 className="text-base">{formatDate(date)}</h2>
      <div className="flex-1" />
      <div>
        <span className="text-text-gentle">Total: </span>
        {total.hours}
        <span className="text-text-gentle">:</span>
        {total.minutes}
      </div>
    </div>
  )
}

interface TimeTableRowProps {
  entry: TimeEntry
  onChange: Dispatch<TimeEntry>
  onRemove: Dispatch<TimeEntry>
}
const TimeTableRow = ({ entry, onChange, onRemove }: TimeTableRowProps) => (
  <li
    className={cn(
      "col-[1_/_-1] grid h-12 grid-cols-subgrid items-center rounded-md px-1",
      "focus-within:bg-background-page/50 hover:bg-background-page/50",
      "[&_input]:bg-transparent [&:not(:hover,:focus-within)_input]:border-transparent"
    )}
  >
    <TimeEntryInputs
      entry={entry}
      onChange={data => onChange({ ...entry, ...data })}
    />
    <IconButton
      title="Delete"
      hideTitle
      icon={Trash}
      onClick={() => onRemove(entry)}
      className="[li:not(:hover,:focus-within)_&]:opacity-0"
    />
  </li>
)

const TimeTableBody = ({
  atom,
  date,
  entries,
}: {
  date: string
  entries: TimeEntry[]
  atom: ReturnType<typeof getDateAtom>
}) => {
  const handleChange = (data: TimeEntry) => {
    if (data.date === date) {
      atom.actions.edit(data.id, data)
      return
    }
    // If date changed, move entry to new table
    atom.actions.remove(data)
    const newAtom = getDateAtom(data.date)
    const add = () => newAtom.actions.add(data)
    if (newAtom.didInit instanceof Promise) {
      void newAtom.didInit.then(add)
    } else {
      add()
    }
  }

  return (
    <ul
      className={cn(
        surface({ look: "card", size: "lg" }),
        "grid grid-cols-[1fr_auto_auto_auto_auto] gap-x-2",
        "rounded-t-none p-0"
      )}
    >
      {entries.map(entry => (
        <TimeTableRow
          entry={entry}
          key={entry.id}
          onRemove={atom.actions.remove}
          onChange={handleChange}
        />
      ))}
    </ul>
  )
}

export const TimeTable = ({ date }: { date: string }) => {
  const { entries, atom } = useDateEntries(date)

  return (
    <>
      <TimeTableHeader date={date} entries={entries} />
      <TimeTableBody atom={atom} date={date} entries={entries} />
    </>
  )
}
