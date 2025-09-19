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
import { timeHelpers } from "utils/time-helpers"

const today = () => new Date().toISOString().split("T")[0]!

const Duration = ({ minutes }: { minutes: number }) => {
  const duration = timeHelpers.toParsed(timeHelpers.fromMinutes(minutes))
  return (
    <>
      {duration.hours}
      <span className="mx-0.5 text-text-gentle">:</span>
      {duration.minutes.toString().padStart(2, "0")}
      <span className="mx-0.5 text-text-gentle">h</span>
    </>
  )
}

const TimeEntryInputs = ({
  entry,
  onChange,
}: {
  entry: TimeEntry
  onChange: Dispatch<Partial<TimeEntry>>
}) => (
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
      <TimeInput value={entry.start} onChange={start => onChange({ start })} />
      <span className="mx-1 text-text-gentle">–⁠</span>
      <TimeInput value={entry.end} onChange={end => onChange({ end })} />
    </div>
    <div className={cn("w-15 text-center text-base")}>
      <Duration minutes={timeHelpers.getDiff(entry.start, entry.end)} />
    </div>
  </>
)

const reducer = (state: TimeEntry, data: Partial<TimeEntry>) => ({
  ...state,
  ...data,
})

const getInitialState = (start?: string): TimeEntry => ({
  id: 0,
  description: "",
  start: start ?? timeHelpers.now({ snap: 15 }),
  end: timeHelpers.now({ snap: 15 }),
  date: today(),
})

const AddNewItem = () => {
  const [data, updateData] = useReducer(reducer, getInitialState())
  const { atom } = useDateEntries(data.date)

  return (
    <div className={cn(hstack({ gap: 2, align: "center" }))}>
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
