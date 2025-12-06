import { PropsWithChildren, useMemo } from "react"

import { Divider } from "components/ui/divider"
import { createColumnHelper, Table } from "components/ui/table"
import { preferencesData } from "data/preferences"
import { type TimeEntry } from "data/time-entries"
import { CategoryName } from "features/components/category-name"
import { useAtomValue } from "lib/yaasl"
import { ClassNameProp } from "types/base-props"
import { cn } from "utils/cn"
import { hstack, surface, vstack } from "utils/styles"
import { timeHelpers } from "utils/time-helpers"

import { Duration } from "./duration"

interface TimeSummary {
  id: string
  description: string
  categoryId: string
  minutes: number
}

const summarize = (entries: TimeEntry[]): TimeSummary[] => {
  const clustered = entries.reduce<Record<string, Record<string, number>>>(
    (result, { description, categoryId = "", start, end }) => {
      if (!result[categoryId]) {
        result[categoryId] = {}
      }
      if (result[categoryId][description] == null) {
        result[categoryId][description] = 0
      }
      result[categoryId][description] += timeHelpers.getDiff(start, end)
      return result
    },
    {}
  )

  return Object.entries(clustered)
    .flatMap(([categoryId, descriptions]) =>
      Object.entries(descriptions).map(([description, minutes]) => ({
        id: `${description}-${categoryId}`,
        categoryId,
        description,
        minutes,
      }))
    )
    .sort((a, b) =>
      a.description && !b.description
        ? -1
        : !a.description && b.description
          ? 1
          : b.minutes - a.minutes
    )
}

interface TableConfig {
  rowData: TimeSummary
}

const Cell = ({
  children,
  muted,
}: PropsWithChildren<ClassNameProp & { muted: boolean }>) => (
  <div
    className={cn(
      hstack({ align: "center" }),
      "h-8 px-2",
      muted && "text-text-muted"
    )}
  >
    {children}
  </div>
)

const helper = createColumnHelper<TableConfig>()
const descriptionColumn = helper.column({
  name: "Description",
  colSize: "col-[1_/_-1] @xl:col-[span_1]",
  className: "flex",
  render: ({ rowData }) => (
    <Cell muted={!rowData.description}>
      {rowData.description || "No description"}
    </Cell>
  ),
})
const categoryColumn = helper.column({
  name: "Category",
  className: "@4xl:*:w-full",
  render: ({ rowData }) => <CategoryName categoryId={rowData.categoryId} />,
})
const durationColumn = helper.column({
  name: "Duration",
  render: ({ rowData }) => (
    <Duration
      minutes={rowData.minutes}
      className="mx-2 inline-block w-15 text-end"
    />
  ),
})

const TimeSummaryTable = ({ summary }: { summary: TimeSummary[] }) => (
  <div className="rounded-b-lg bg-background">
    <Table<TableConfig>
      hideHeaders
      name="time-table"
      gridCols="grid-cols-[1fr_auto] @xl:grid-cols-[1fr_auto_auto]"
      rowData={summary}
      rowMeta={{}}
      columns={[descriptionColumn, categoryColumn, durationColumn]}
    />
  </div>
)

const SummaryBlock = ({ description, categoryId, minutes }: TimeSummary) => (
  <div className={cn(surface({ look: "card", size: "md" }), vstack({}))}>
    <div className={cn("line-clamp-2", !description && "text-text-muted")}>
      {description || "No description"}
    </div>

    <div className="flex-1" />

    <Divider color="gentle" className="my-2" />
    <div className={hstack({ justify: "between" })}>
      <CategoryName categoryId={categoryId} />
      <Duration minutes={minutes} />
    </div>
  </div>
)

const TimeSummaryGrid = ({ summary }: { summary: TimeSummary[] }) => (
  <div className="@container m-2 text-base">
    <div className="grid grid-cols-1 gap-4 @xl:grid-cols-2 @3xl:grid-cols-3">
      {summary.map(entry => (
        <SummaryBlock key={entry.id} {...entry} />
      ))}
    </div>
  </div>
)

export const TimeSummary = ({ entries }: { entries: TimeEntry[] }) => {
  const { summaryStyle } = useAtomValue(preferencesData)
  const summary = useMemo(() => summarize(entries), [entries])

  return summaryStyle === "table" ? (
    <TimeSummaryTable summary={summary} />
  ) : (
    <TimeSummaryGrid summary={summary} />
  )
}
