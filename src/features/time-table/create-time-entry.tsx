import { useReducer } from "react"

import { Plus } from "lucide-react"

import { IconButton } from "components/ui/icon-button"
import { useDateEntries, type TimeEntry } from "data/time-entries"
import { cn } from "utils/cn"
import { timeHelpers } from "utils/time-helpers"

import { Duration } from "./duration"
import { inputs } from "./inputs"

const today = () => new Date().toISOString().split("T")[0]!

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

export const CreateTimeEntry = () => {
  const [data, updateData] = useReducer(reducer, getInitialState())
  const { atom } = useDateEntries(data.date)

  return (
    <div className="@container w-full flex-1">
      <div
        className={cn(
          "grid items-center gap-2",
          "grid-cols-[1fr_auto_auto_auto] @2xl:grid-cols-[1fr_auto_auto_auto_auto]"
        )}
      >
        <inputs.Description
          entry={data}
          onChange={updateData}
          className="col-[1_/_-1] @2xl:col-[span_1]"
        />
        <inputs.Date entry={data} onChange={updateData} />
        <inputs.TimeRange entry={data} onChange={updateData} />
        <Duration entries={[data]} className="inline-block w-15 text-center" />
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
    </div>
  )
}
