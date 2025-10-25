import { Dispatch } from "react"

import { Trash } from "lucide-react"

import { Checkbox } from "components/ui/checkbox"
import { showDialog } from "components/ui/dialog"
import { IconButton } from "components/ui/icon-button"
import { createColumnHelper, Table } from "components/ui/table"
import { getDateAtom, useDateEntries, type TimeEntry } from "data/time-entries"

import { useCheckedState } from "./checked-context"
import { Duration } from "./duration"
import { inputs } from "./inputs"

interface CheckedProps {
  checked: Record<string, true>
  toggleChecked: Dispatch<TimeEntry>
}

interface TimeTableRowsProps extends ReturnType<typeof useDateEntries> {
  date: string
}

interface TableConfig {
  rowData: TimeEntry
  rowMeta: CheckedProps & {
    onChange: Dispatch<TimeEntry>
    onRemove: Dispatch<string>
  }
}

const helper = createColumnHelper<TableConfig>()
const checkedColumn = helper.column({
  name: "Selected",
  render: ({ rowData, checked, toggleChecked }) => (
    <Checkbox
      checked={checked[rowData.id] ?? false}
      onCheckedChange={() => toggleChecked(rowData)}
    />
  ),
})
const descriptionColumn = helper.column({
  name: "Description",
  colSize: "col-[2_/_-1] @xl:col-[2_/_-1] @4xl:col-[span_1]",
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
  colSize: "col-[2_/_6] @xl:col-[2] @4xl:col-[span_1]",
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
  colSize:
    "col-[6_/_-1] justify-self-end @xl:justify-self-start @xl:col-[auto]",
  render: ({ rowData, onChange }) => (
    <inputs.Date
      entry={rowData}
      onChange={data => onChange({ ...rowData, ...data })}
    />
  ),
})
const timeStartColumn = helper.column({
  name: "Time Start",
  colSize: "col-[2] @xl:col-[auto]",
  render: ({ rowData, onChange }) => (
    <inputs.TimeStart
      entry={rowData}
      onChange={data => onChange({ ...rowData, ...data })}
    />
  ),
})
const timeSeparatorColumn = helper.decorator({
  name: "",
  render: inputs.TimeSeparator,
})
const timeEndColumn = helper.column({
  name: "Time End",
  render: ({ rowData, onChange }) => (
    <inputs.TimeEnd
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
  colSize: "col-[7] @xl:col-[auto]",
  render: ({ rowData, onRemove }) => (
    <IconButton
      title="Delete"
      hideTitle
      icon={Trash}
      onClick={() => onRemove(rowData.id)}
      className="@4xl:[[role='row']:not(:hover,:focus-within)_&]:opacity-0"
    />
  ),
})

export const TimeTableEditable = ({
  date,
  atom,
  entries,
}: TimeTableRowsProps) => {
  const { checkedByDate, toggleChecked } = useCheckedState()

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

  const handleRemove = (id: string) =>
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
      hideHeaders
      name="time-table"
      gridCols="grid-cols-[2.5rem_auto_auto_auto_auto_1fr_2.5rem] @xl:grid-cols-[2.5rem_1fr_auto_auto_auto_auto_auto_2.5rem] @4xl:grid-cols-[2.5rem_1fr_auto_auto_auto_auto_auto_auto_2.5rem]"
      rowData={entries}
      columns={[
        checkedColumn,
        descriptionColumn,
        projectColumn,
        dateColumn,
        timeStartColumn,
        timeSeparatorColumn,
        timeEndColumn,
        durationColumn,
        actionColumn,
      ]}
      rowMeta={{
        checked: checkedByDate(date),
        toggleChecked,
        onChange: handleChange,
        onRemove: handleRemove,
      }}
    />
  )
}
