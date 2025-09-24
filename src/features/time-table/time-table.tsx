import { Dispatch, useState } from "react"

import { Trash } from "lucide-react"

import { Checkbox } from "components/ui/checkbox"
import { showDialog } from "components/ui/dialog"
import { IconButton } from "components/ui/icon-button"
import { createColumnHelper, Table } from "components/ui/table"
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

interface CheckedProps {
  checked: Record<string, boolean>
  onCheckedChange: Dispatch<TimeEntry>
}

interface TimeTableRowsProps
  extends CheckedProps,
    ReturnType<typeof useDateEntries> {
  date: string
}

interface TableConfig {
  rowData: TimeEntry
  rowMeta: CheckedProps & {
    onChange: Dispatch<TimeEntry>
    onRemove: Dispatch<number>
  }
}

const helper = createColumnHelper<TableConfig>()
const checkedColumn = helper.column({
  name: "Selected",
  render: ({ rowData, checked, onCheckedChange }) => (
    <Checkbox
      checked={checked[rowData.id] ?? false}
      onCheckedChange={() => onCheckedChange(rowData)}
    />
  ),
})
const descriptionColumn = helper.column({
  name: "Description",
  colSize: "col-[2_/_-1] @4xl:col-[span_1]",
  className: "flex",
  render: ({ rowData, onChange }) => (
    <inputs.Description
      entry={rowData}
      onChange={data => onChange({ ...rowData, ...data })}
    />
  ),
})
const projectColumn = helper.column({
  name: "Project",
  colSize: "col-[2] @4xl:col-[span_1]",
  className: "@4xl:*:w-full",
  render: ({ rowData, onChange }) => (
    <inputs.Project
      entry={rowData}
      onChange={data => onChange({ ...rowData, ...data })}
    />
  ),
})
const dateColumn = helper.column({
  name: "Date",
  render: ({ rowData, onChange }) => (
    <inputs.Date
      entry={rowData}
      onChange={data => onChange({ ...rowData, ...data })}
    />
  ),
})
const timeColumn = helper.column({
  name: "Time Range",
  render: ({ rowData, onChange }) => (
    <inputs.TimeRange
      entry={rowData}
      onChange={data => onChange({ ...rowData, ...data })}
    />
  ),
})
const durationColumn = helper.column({
  name: "Duration",
  render: ({ rowData }) => (
    <Duration entries={[rowData]} className="inline-block w-15 text-center" />
  ),
})
const actionColumn = helper.column({
  name: "Actions",
  render: ({ rowData, onRemove }) => (
    <IconButton
      title="Delete"
      hideTitle
      icon={Trash}
      onClick={() => onRemove(rowData.id)}
      className="[[role='row']:not(:hover,:focus-within)_&]:opacity-0"
    />
  ),
})

const TimeTableRows = ({
  date,
  atom,
  entries,
  checked,
  onCheckedChange,
}: TimeTableRowsProps) => {
  const handleChange = (data: TimeEntry) => {
    if (data.date === date) {
      atom.actions.edit(data.id, data)
      return
    }
    // If date changed, move entry to new table
    atom.actions.delete(data.id)
    const newAtom = getDateAtom(data.date)
    const add = () => newAtom.actions.add(data)
    if (newAtom.didInit instanceof Promise) {
      void newAtom.didInit.then(add)
    } else {
      add()
    }
  }

  const handleRemove = (id: number) =>
    showDialog({
      title: "Delete time entry?",
      description:
        "Do you really want to delete this time entry? This action cannot be reverted.",
      confirm: {
        caption: "Delete",
        look: "destructive",
        onClick: () => atom.actions.delete(id),
      },
    })

  return (
    <Table<TableConfig>
      gridCols="grid-cols-[auto_1fr_auto_auto_auto_auto] @4xl:grid-cols-[auto_1fr_auto_auto_auto_auto_auto]"
      rowData={entries}
      columns={[
        checkedColumn,
        descriptionColumn,
        projectColumn,
        dateColumn,
        timeColumn,
        durationColumn,
        actionColumn,
      ]}
      rowMeta={{
        checked,
        onCheckedChange,
        onChange: handleChange,
        onRemove: handleRemove,
      }}
    />
  )
}

interface TimeTableProps extends CheckedProps {
  date: string
}

export const TimeTable = ({ date, ...rest }: TimeTableProps) => {
  const { entries, atom } = useDateEntries(date)

  return (
    <div className={cn(surface({ look: "card", size: "lg" }), "isolate p-0")}>
      <TimeTableHeader date={date} entries={entries} />
      <TimeTableRows date={date} entries={entries} atom={atom} {...rest} />
    </div>
  )
}
