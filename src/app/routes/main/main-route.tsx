import { Dispatch, Fragment, useReducer } from "react"

import { Plus } from "lucide-react"

import { IconButton } from "components/ui/icon-button"
import { Input } from "components/ui/input"
import { TimeInput } from "components/ui/time-input"
import {
  useDateEntries,
  useTrackedDates,
  type TimeEntry,
} from "data/time-entries"
import { TimeTable } from "features/time-table"
import { cn } from "utils/cn"
import { hstack } from "utils/styles"

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

const reducer = (state: TimeEntry, data: Partial<TimeEntry>) => ({
  ...state,
  ...data,
})

const snap = (value: number, snap: number) => Math.round(value / snap) * snap
const formatTime = (value: number) => String(value).padStart(2, "0")

const currentTime = () => {
  const date = new Date()
  const hours = date.getHours()
  const minutes = snap(date.getMinutes(), 15)

  const segments = minutes >= 60 ? [hours + 1, minutes % 60] : [hours, minutes]

  return segments.map(formatTime).join(":")
}

const getInitialState = (start?: string): TimeEntry => ({
  id: 0,
  description: "",
  start: start ?? currentTime(),
  end: currentTime(),
  date: today(),
})

const AddNewItem = () => {
  const [data, updateData] = useReducer(reducer, getInitialState())
  const { atom } = useDateEntries(data.date)

  return (
    <div className={cn(hstack({ gap: 2 }))}>
      <TimeEntryInputs entry={data} onChange={updateData} />
      <IconButton
        icon={Plus}
        title="Add item"
        hideTitle
        onClick={() => {
          atom.actions.add(data)
          updateData(getInitialState(data.end))
        }}
      />
    </div>
  )
}

const MainRoute = () => {
  const trackedDates = useTrackedDates()
  return (
    <div className="px-10">
      <AddNewItem />
      <div className="mt-4" />
      {trackedDates.map(date => (
        <Fragment key={date}>
          <div className="mt-4" />
          <TimeTable date={date} />
        </Fragment>
      ))}
    </div>
  )
}

export default MainRoute
