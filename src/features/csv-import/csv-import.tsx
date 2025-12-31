import { Dispatch, useMemo } from "react"

import { t } from "@lingui/core/macro"

import { Dialog } from "components/ui/dialog"
import { TimeEntry } from "data/time-entries"
import { useObjectState } from "hooks/use-object-state"
import { cn } from "utils/cn"
import { hstack, vstack } from "utils/styles"

import { Preview } from "./fragments/preview"
import { CategoryMapping, SelectCategory } from "./fragments/select-categories"
import { SelectColumns, ColumnLookup } from "./fragments/select-columns"
import { buildRows } from "./utils/build-rows"
import { processCsv } from "./utils/process-csv"

const getImportedCategories = (rows: string[][], categoryIndex: number) => {
  const allCategories = rows
    .map(row => row[categoryIndex])
    .filter(Boolean) as string[]

  return [...new Set(allCategories)].sort()
}

const findHeader = (headers: string[], columnName: string) => {
  const nameParts = columnName.toLowerCase().split(/\s+/)
  return headers.findIndex(header =>
    nameParts.every(part => header.toLowerCase().includes(part))
  )
}
const getInitialColumnLookup = (headers: string[]): ColumnLookup => ({
  date: findHeader(headers, "date"),
  description: findHeader(headers, "description"),
  category: findHeader(headers, "category"),
  timeStart: findHeader(headers, "time start"),
  timeEnd: findHeader(headers, "time end"),
})

interface CsvImportProps {
  csv: string
  onImport: Dispatch<TimeEntry[]>
  onClose: () => void
}
export const CsvImport = ({ csv, onImport, onClose }: CsvImportProps) => {
  const [categoryMapping, updateCategoryMapping] =
    useObjectState<CategoryMapping>({})

  const { headers, rows } = useMemo(() => processCsv(csv), [csv])
  const [columnLookup, updateColumnLookup] = useObjectState<ColumnLookup>(
    getInitialColumnLookup(headers)
  )

  const importedCategories = useMemo(
    () => getImportedCategories(rows, columnLookup.category ?? -1),
    [columnLookup.category, rows]
  )
  const data = useMemo(
    () => buildRows(rows, columnLookup, categoryMapping),
    [columnLookup, rows, categoryMapping]
  )

  return (
    <Dialog
      title={t`CSV Import`}
      description={t`Provide information about the .csv file to be used for the import.`}
      onClose={onClose}
      className="h-[calc(100vh-3rem)] w-[calc(100vw-3rem)]"
      confirm={{
        caption: t`Finish import`,
        look: "ghost",
        onClick: () => onImport(data),
      }}
      cancel={{}}
    >
      <div className={cn(vstack({ justify: "evenly" }), "h-full")}>
        <div className={cn(hstack({}), "pb-2 *:flex-1 tablet:flex-col")}>
          <SelectColumns
            headers={headers}
            columnLookup={columnLookup}
            onColumnLookupChange={updateColumnLookup}
          />
          <SelectCategory
            importedCategories={importedCategories}
            categoryMapping={categoryMapping}
            onCategoryMappingChange={updateCategoryMapping}
          />
        </div>

        <div>
          <Preview data={data} />
        </div>
      </div>
    </Dialog>
  )
}
