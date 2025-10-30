import { useEffect, useMemo, useState } from "react"

import { Input } from "components/ui/input"
import { PageRange, Pagination } from "components/ui/pagination"
import { timeEntriesData, TimeEntry } from "data/time-entries"
import { ProjectSelect } from "features/components/project-select"
import {
  CheckedStateProvider,
  TimeEntriesBulkActions,
  TimeTable,
  useCheckedState,
} from "features/time-table"
import { useObjectState } from "hooks/use-object-state"
import { useAtomValue } from "lib/yaasl"
import { cn } from "utils/cn"
import { fuzzyFilter } from "utils/fuzzy-filter"
import { hstack, vstack } from "utils/styles"

const SearchTable = ({ filtered }: { filtered: TimeEntry[] }) => {
  const [pageRange, setPageRange] = useState<PageRange>({ start: 0, end: 10 })
  const { resetChecked } = useCheckedState()

  const pageEntries = useMemo(
    () => filtered.slice(pageRange.start, pageRange.end),
    [filtered, pageRange.end, pageRange.start]
  )

  useEffect(() => {
    resetChecked()
  }, [resetChecked, pageEntries])

  return (
    <>
      <TimeEntriesBulkActions />

      <div className="h-max max-h-max flex-1 overflow-y-auto">
        <TimeTable
          title={`Search Results (${filtered.length})`}
          entries={pageEntries}
          stickyHeader="top-0"
        />
      </div>

      <Pagination
        items={filtered.length}
        pageSizes={[10, 15, 20, 25, 30]}
        onRangeChange={setPageRange}
        className="pt-4 pl-1"
      />
    </>
  )
}

const sortLatestTop = (a: TimeEntry, b: TimeEntry) => {
  const stampA = `${a.date}_${a.start}_${a.end}`
  const stampB = `${b.date}_${b.start}_${b.end}`
  return stampB.localeCompare(stampA)
}

export const SearchRoute = () => {
  const raw = useAtomValue(timeEntriesData)
  const allFlat = useMemo(
    () => Object.values(raw).flat().sort(sortLatestTop),
    [raw]
  )

  const [filter, setFilter] = useObjectState<Partial<TimeEntry>>({})

  const filtered = useMemo(() => {
    let filtered = allFlat

    if (filter.projectId) {
      filtered = filtered.filter(
        ({ projectId }) => projectId === filter.projectId
      )
    }

    if (filter.description) {
      filtered = fuzzyFilter({
        items: allFlat,
        filter: filter.description,
        getFilterValue: item => item.description,
      })
    }

    return filtered
  }, [allFlat, filter.description, filter.projectId])

  return (
    <div className={cn(vstack({}), "h-full px-10 pt-6")}>
      <div className={cn(hstack({ gap: 2 }), "mb-4")}>
        <Input
          type="text"
          placeholder="Description"
          value={filter.description ?? ""}
          onChange={description => setFilter({ description })}
          className="flex-1"
        />
        <ProjectSelect
          value={filter.projectId ?? ""}
          onChange={projectId => setFilter({ projectId })}
          className="min-w-45"
        />
      </div>

      <CheckedStateProvider>
        <SearchTable filtered={filtered} />
      </CheckedStateProvider>

      <div className="pb-8" />
    </div>
  )
}
