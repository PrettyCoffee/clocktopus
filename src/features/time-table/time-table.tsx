import { Dispatch, useState } from "react"

import { Trash } from "lucide-react"

import { Checkbox } from "components/ui/checkbox"
import { showDialog } from "components/ui/dialog"
import { IconButton } from "components/ui/icon-button"
import { createColumnHelper, Table } from "components/ui/table"
import { Tooltip } from "components/ui/tooltip"
import { projectsData } from "data/projects"
import { getDateAtom, useDateEntries, type TimeEntry } from "data/time-entries"
import { ProjectName } from "features/components/project-name"
import { useIntersectionObserver } from "hooks/use-intersection-observer"
import { useAtomValue } from "lib/yaasl"
import { cn } from "utils/cn"
import { getLocale } from "utils/get-locale"
import { hstack, surface, vstack } from "utils/styles"
import { timeHelpers } from "utils/time-helpers"

import { Duration } from "./duration"
import { inputs } from "./inputs"

const formatDate = (date: string) => {
  const locale = getLocale()
  if (locale === "iso") {
    const weekday = new Date(date).toLocaleDateString("en", {
      weekday: "short",
    })
    return `${weekday}, ${date}`
  }
  return new Date(date).toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    weekday: "short",
  })
}

const DateDurations = ({ entries }: { entries: TimeEntry[] }) => {
  const projects = useAtomValue(projectsData)

  const totalTimeByProject = [{ id: undefined }, ...projects]
    .map(project => {
      const items = entries.filter(entry => entry.projectId === project.id)
      const minutes = items.reduce(
        (result, { start, end }) => result + timeHelpers.getDiff(start, end),
        0
      )
      return {
        projectId: project.id,
        minutes,
        duration: timeHelpers.fromMinutes(minutes),
      }
    })
    .filter(({ minutes }) => minutes > 0)
    .sort((a, b) => b.minutes - a.minutes)

  const total = totalTimeByProject.reduce(
    (result, { minutes }) => result + minutes,
    0
  )
  const totalDuration = (
    <span className="px-4 text-base">
      <span className="text-text-gentle">Total: </span>
      <Duration minutes={total} />
    </span>
  )

  return total === 0 ? (
    totalDuration
  ) : (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <button className="rounded-md">{totalDuration}</button>
      </Tooltip.Trigger>
      <Tooltip.Content align="end" asChild>
        <div className={cn(vstack({ justify: "end" }), "text-sm")}>
          {totalTimeByProject.map(({ duration, projectId }) => (
            <span
              key={projectId}
              className={hstack({ justify: "between", gap: 2 })}
            >
              <ProjectName projectId={projectId} />
              <span className="font-mono">{duration}</span>
            </span>
          ))}
        </div>
      </Tooltip.Content>
    </Tooltip.Root>
  )
}

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
          "h-10 rounded-t-lg border-b border-stroke-gentle bg-background-page",
          "sticky top-18 z-20",
          !isIntersecting && "rounded-lg"
        )}
      >
        <h2 className="px-4 text-base">{formatDate(date)}</h2>
        <div className="flex-1" />
        <DateDurations entries={entries} />
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
const timeStartColumn = helper.column({
  name: "Time Start",
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
      hideHeaders
      name="time-table"
      gridCols="grid-cols-[auto_1fr_auto_auto_auto_auto_auto_auto] @4xl:grid-cols-[auto_1fr_auto_auto_auto_auto_auto_auto_auto]"
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
