import { Dispatch, useMemo } from "react"

import { Dialog } from "components/ui/dialog"
import { TimeEntry } from "data/time-entries"
import { useObjectState } from "hooks/use-object-state"
import { cn } from "utils/cn"
import { hstack, vstack } from "utils/styles"

import { Preview } from "./fragments/preview"
import { SelectColumns, ColumnLookup } from "./fragments/select-columns"
import { ProjectMapping, SelectProjects } from "./fragments/select-projects"
import { buildRows } from "./utils/build-rows"
import { processCsv } from "./utils/process-csv"

const getImportedProjects = (rows: string[][], projectIndex: number) => {
  const allProjects = rows
    .map(row => row[projectIndex])
    .filter(Boolean) as string[]

  return [...new Set(allProjects)].sort()
}

interface CsvImportProps {
  csv: string
  onImport: Dispatch<TimeEntry[]>
  onClose: () => void
}
export const CsvImport = ({ csv, onImport, onClose }: CsvImportProps) => {
  const [columnLookup, updateColumnLookup] = useObjectState<ColumnLookup>({})
  const [projectMapping, updateProjectMapping] = useObjectState<ProjectMapping>(
    {}
  )

  const { headers, rows } = useMemo(() => processCsv(csv), [csv])

  const importedProjects = useMemo(
    () => getImportedProjects(rows, columnLookup.project ?? -1),
    [columnLookup.project, rows]
  )
  const data = useMemo(
    () => buildRows(rows, columnLookup, projectMapping),
    [columnLookup, rows, projectMapping]
  )

  return (
    <Dialog
      title="CSV Import"
      description="Provide information about the .csv file to be used for the import."
      onClose={onClose}
      className="h-[calc(100vh-3rem)] w-[calc(100vw-3rem)]"
      confirm={{
        caption: "Finish import",
        look: "ghost",
        onClick: () => onImport(data),
      }}
      cancel={{}}
    >
      <div className={cn(vstack({ justify: "evenly" }), "h-full")}>
        <div className={cn(hstack({}), "pb-2 *:flex-1")}>
          <SelectColumns
            headers={headers}
            columnLookup={columnLookup}
            onColumnLookupChange={updateColumnLookup}
          />
          <SelectProjects
            importedProjects={importedProjects}
            projectMapping={projectMapping}
            onProjectMappingChange={updateProjectMapping}
          />
        </div>

        <div>
          <Preview data={data} />
        </div>
      </div>
    </Dialog>
  )
}
