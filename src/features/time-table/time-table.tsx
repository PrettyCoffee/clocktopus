import { Dispatch, useState } from "react"

import { Trash } from "lucide-react"

import { showDialog } from "components/ui/dialog"
import { IconButton } from "components/ui/icon-button"
import { getDateAtom, useDateEntries, type TimeEntry } from "data/time-entries"
import { useIntersectionObserver } from "hooks/use-intersection-observer"
import { cn } from "utils/cn"
import { getLocale } from "utils/get-locale"
import { hstack, surface } from "utils/styles"

import { Duration } from "./duration"
import { inputs } from "./inputs"

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString(getLocale(), {
    day: "2-digit",
    month: "short",
    weekday: "short",
  })

interface TimeTableHeaderProps {
  date: string
  entries: TimeEntry[]
}
const TimeTableHeader = ({ date, entries }: TimeTableHeaderProps) => {
  const [topOffset, setTopOffset] = useState("0px")
  const { ref, isIntersecting } = useIntersectionObserver({
    rootMargin: `-${topOffset} 0px 0px 0px`, // trigger offset to the top of the scroll area (window)
  })

  return (
    <>
      <div ref={ref} />
      <div
        ref={element => {
          if (!element) return
          const styles = getComputedStyle(element)
          setTopOffset(styles.top)
        }}
        className={cn(
          hstack({ align: "center" }),
          "h-10 rounded-t-lg border-b border-stroke-gentle bg-background-page p-4",
          "sticky top-18 z-20",
          !isIntersecting && "rounded-lg"
        )}
      >
        <h2 className="text-base">{formatDate(date)}</h2>
        <div className="flex-1" />
        <div className="text-base">
          <span className="text-text-gentle">Total: </span>
          <Duration entries={entries} />
        </div>
      </div>
    </>
  )
}

interface TimeTableRowProps {
  entry: TimeEntry
  onChange: Dispatch<TimeEntry>
  onRemove: Dispatch<TimeEntry>
}
const TimeTableRow = ({ entry, onChange, onRemove }: TimeTableRowProps) => {
  const updateData = (data: Partial<TimeEntry>) =>
    onChange({ ...entry, ...data })

  const handleRemove = () =>
    showDialog({
      title: "Delete time entry?",
      description:
        "Do you really want to delete this time entry? This action cannot be reverted.",
      confirm: {
        caption: "Delete",
        look: "destructive",
        onClick: () => onRemove(entry),
      },
    })

  return (
    <div
      role="row"
      className={cn(
        "col-[1_/_-1] grid h-12 grid-cols-subgrid items-center rounded-md px-1",
        "focus-within:bg-background-page/50 hover:bg-background-page/50",
        "[&_input]:bg-transparent [&:not(:hover,:focus-within)_input]:border-transparent"
      )}
    >
      <div role="gridcell" className="flex">
        <inputs.Description entry={entry} onChange={updateData} />
      </div>
      <div role="gridcell">
        <inputs.Date entry={entry} onChange={updateData} />
      </div>
      <div role="gridcell">
        <inputs.TimeRange entry={entry} onChange={updateData} />
      </div>
      <div role="gridcell">
        <Duration entries={[entry]} className="inline-block w-15 text-center" />
      </div>
      <div role="gridcell">
        <IconButton
          title="Delete"
          hideTitle
          icon={Trash}
          onClick={handleRemove}
          className="[li:not(:hover,:focus-within)_&]:opacity-0"
        />
      </div>
    </div>
  )
}

interface TimeTableBodyProps {
  entries: TimeEntry[]
  onChange: Dispatch<TimeEntry>
  onRemove: Dispatch<TimeEntry>
}
const TimeTableBody = ({ entries, onChange, onRemove }: TimeTableBodyProps) => (
  <div
    role="rowgroup"
    className={cn("grid grid-cols-[1fr_auto_auto_auto_auto] gap-x-2")}
  >
    {entries.map(entry => (
      <TimeTableRow
        entry={entry}
        key={entry.id}
        onRemove={onRemove}
        onChange={onChange}
      />
    ))}
  </div>
)

export const TimeTable = ({ date }: { date: string }) => {
  const { entries, atom } = useDateEntries(date)

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
    <div className={cn(surface({ look: "card", size: "lg" }), "isolate p-0")}>
      <TimeTableHeader date={date} entries={entries} />
      <div role="grid">
        <div role="row" className="sr-only">
          <div role="columnheader">Description</div>
          <div role="columnheader">Date</div>
          <div role="columnheader">Time Range</div>
          <div role="columnheader">Duration</div>
          <div role="columnheader">Actions</div>
        </div>
        <TimeTableBody
          entries={entries}
          onChange={handleChange}
          onRemove={atom.actions.remove}
        />
      </div>
    </div>
  )
}
