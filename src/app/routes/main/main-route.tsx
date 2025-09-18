import { Dispatch, useReducer } from "react"

import { Plus, Trash } from "lucide-react"

import { Card } from "components/ui/card"
import { IconButton } from "components/ui/icon-button"
import { Input } from "components/ui/input"
import { TimeInput } from "components/ui/time-input"
import {
  getDateAtom,
  useDateEntries,
  useTrackedDates,
  type TimeEntry,
} from "data/time-entries"
import { cn } from "utils/cn"
import { hstack } from "utils/styles"

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
      onChange={date => onChange({ date })}
    />
    <TimeInput value={entry.start} onChange={start => onChange({ start })} />
    <TimeInput value={entry.end} onChange={end => onChange({ end })} />
  </>
)

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

const today = () => new Date().toISOString().split("T")[0]!

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
        onClick={() => {
          atom.actions.add(data)
          updateData(getInitialState(data.end))
        }}
      />
    </div>
  )
}

const DateTimeTable = ({ date }: { date: string }) => {
  const { entries, atom } = useDateEntries(date)

  return (
    <Card title={date} description="" className="-mx-2">
      <ul className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-x-2">
        {entries.map(entry => (
          <li
            key={entry.id}
            className={cn(
              "col-[1_/_-1] grid h-10 grid-cols-subgrid items-center rounded-md *:border-transparent *:bg-transparent focus-within:bg-background-page/50 hover:bg-background-page/50"
            )}
          >
            <TimeEntryInputs
              entry={entry}
              onChange={data => {
                const newEntry = { ...entry, ...data }
                if (newEntry.date === date) {
                  atom.actions.edit(entry.id, data)
                  return
                }
                // Move entry to new date
                atom.actions.remove(newEntry)
                const newAtom = getDateAtom(newEntry.date)
                const add = () => newAtom.actions.add(newEntry)
                if (newAtom.didInit instanceof Promise) {
                  void newAtom.didInit.then(add)
                } else {
                  add()
                }
              }}
            />
            <IconButton
              title="Delete"
              icon={Trash}
              onClick={() => atom.actions.remove(entry)}
            />
          </li>
        ))}
      </ul>
    </Card>
  )
}

const MainRoute = () => {
  const trackedDates = useTrackedDates()
  return (
    <div className="px-10">
      <AddNewItem />
      <div className="mt-4" />
      {trackedDates.map(date => (
        <DateTimeTable key={date} date={date} />
      ))}
    </div>
  )
}

export default MainRoute
