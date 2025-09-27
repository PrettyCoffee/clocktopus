import { Fragment, ReactNode } from "react"

import { cn } from "utils/cn"
import { createContext } from "utils/create-context"
import { createId } from "utils/create-id"

import { gridNavigationFocus } from "./grid-navigation-focus"

type Repeat<T extends string> = T | `${T} ${T}` | `${T} ${T} ${T}`

interface TableData {
  id: string | number
}

interface TableConfig {
  rowData: TableData
  rowMeta?: {} | undefined
}

type TwColSize = `col-[${string}]` | `@${string}:col-[${string}]`
interface ColumnDef<TConfig extends TableConfig> {
  id: string | number
  type: "data" | "decorator"
  name: string
  colSize?: Repeat<TwColSize>
  className?: string
  render: (
    props: { rowData: TConfig["rowData"] } & TConfig["rowMeta"]
  ) => ReactNode
}

type TwGridCols = `grid-cols-[${string}]` | `@${string}:grid-cols-[${string}]`
type TableProps<TConfig extends TableConfig> = Pick<TConfig, "rowMeta"> & {
  rowData: TConfig["rowData"][]
  columns: ColumnDef<TConfig>[]
  gridCols: Repeat<TwGridCols>
}

const Context = createContext<TableProps<TableConfig>>("TableProps")

interface TableRowProps {
  data: TableData
}
const TableRow = ({ data }: TableRowProps) => {
  const { columns, rowMeta } = Context.useRequiredValue()

  const cellPropsByType = {
    decorator: {},
    data: {
      role: "gridcell",
      tabIndex: -1,
      onKeyDown: gridNavigationFocus,
    },
  }

  return (
    <div
      role="row"
      className={cn(
        "col-[1_/_-1] grid grid-cols-subgrid items-center gap-1 rounded-md p-1",
        "focus-within:bg-background-page/50 hover:bg-background-page/50",
        "[&_input]:bg-transparent [&:not(:hover,:focus-within)_:is(input,button)]:border-transparent"
      )}
    >
      {columns.map(column => (
        <div
          key={`${data.id}${column.id}`}
          className={cn(column.colSize, column.className)}
          {...cellPropsByType[column.type]}
        >
          {column.render({ rowData: data, ...rowMeta })}
        </div>
      ))}
    </div>
  )
}

const TableBody = () => {
  const { gridCols, rowData } = Context.useRequiredValue()

  return (
    <div role="rowgroup" className={cn("grid gap-x-2", gridCols)}>
      {rowData.map((data, index) => (
        <Fragment key={data.id}>
          {index !== 0 && (
            <div className="col-[1_/_-1] mx-2 border-b border-stroke-gentle" />
          )}

          <TableRow data={data} />
        </Fragment>
      ))}
    </div>
  )
}

const TableHeader = () => {
  const { columns } = Context.useRequiredValue()

  return (
    <div role="row" className="sr-only">
      {columns.map(column => (
        <div key={column.id} role="columnheader">
          {column.name}
        </div>
      ))}
    </div>
  )
}

export const Table = <TConfig extends TableConfig>(
  props: TableProps<TConfig>
) => (
  <Context value={props as unknown as TableProps<TableConfig>}>
    <div role="grid" className="@container">
      <TableHeader />
      <TableBody />
    </div>
  </Context>
)

export const createColumnHelper = <TConfig extends TableConfig>() => {
  const column = (
    colDef: Omit<ColumnDef<TConfig>, "id" | "type">
  ): ColumnDef<TConfig> => ({
    ...colDef,
    type: "data",
    id: createId("mini"),
  })

  const decorator = (
    colDef: Omit<ColumnDef<TConfig>, "id" | "type">
  ): ColumnDef<TConfig> => ({
    ...colDef,
    type: "decorator",
    id: createId("mini"),
  })

  return { column, decorator }
}
