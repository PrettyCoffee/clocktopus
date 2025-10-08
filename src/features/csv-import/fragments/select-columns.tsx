import { Dispatch, Fragment } from "react"

import { Select } from "components/ui/select"
import { ClassNameProp } from "types/base-props"
import { cn } from "utils/cn"

import { Container } from "./container"

interface ColumnSelectProps extends ClassNameProp {
  value: number | undefined
  headers: string[]
  onChange: Dispatch<number | undefined>
}
const ColumnSelect = ({
  headers,
  value,
  onChange,
  className,
}: ColumnSelectProps) => (
  <Select.Root
    placeholder="CSV Column"
    value={String(value)}
    onChange={value => {
      const number = Number(value)
      onChange(Number.isNaN(number) ? undefined : number)
    }}
    className={cn("w-full", className)}
  >
    <Select.Option value="undefined" label="No column">
      <span className="text-text-muted">No column</span>
    </Select.Option>
    <Select.Separator />

    {headers.map((header, index) => (
      <Select.Option key={header} value={String(index)}>
        {header}
      </Select.Option>
    ))}
  </Select.Root>
)
export interface ColumnLookup {
  date?: number
  description?: number
  project?: number
  timeStart?: number
  timeEnd?: number
}

const columnSelects: { label: string; key: keyof ColumnLookup }[] = [
  { key: "date", label: "Date" },
  { key: "description", label: "Description" },
  { key: "project", label: "Project" },
  { key: "timeStart", label: "Time Start" },
  { key: "timeEnd", label: "Time End" },
]

export const SelectColumns = ({
  headers,
  columnLookup,
  onColumnLookupChange,
}: {
  headers: string[]
  columnLookup: ColumnLookup
  onColumnLookupChange: Dispatch<ColumnLookup>
}) => (
  <Container title="Select columns">
    <div className="grid grid-cols-[auto_1fr] items-center gap-2">
      {columnSelects.map(({ key, label }) => (
        <Fragment key={key}>
          <span>{label}:</span>
          <ColumnSelect
            headers={headers}
            value={columnLookup[key]}
            onChange={columnName => onColumnLookupChange({ [key]: columnName })}
          />
        </Fragment>
      ))}
    </div>
  </Container>
)
