import { useEffect, useMemo, useState } from "react"

import { t } from "@lingui/core/macro"

import { PageRange, Pagination } from "components/ui/pagination"
import { TimeEntry } from "data/time-entries"
import {
  CheckedStateProvider,
  TimeEntriesBulkActions,
  TimeTable,
  useCheckedState,
} from "features/time-table"

const pageSizes = [10, 15, 20, 25, 30] as const satisfies number[]
const initialPageSize = 15 as const

const SearchTableInner = ({ filtered }: { filtered: TimeEntry[] }) => {
  const [pageRange, setPageRange] = useState<PageRange>({ start: 0, end: 15 })
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
          title={t`Search Results (${filtered.length})`}
          entries={pageEntries}
          stickyHeader="top-0"
        />
      </div>

      <Pagination
        items={filtered.length}
        initialPageSize={initialPageSize}
        pageSizes={pageSizes}
        onRangeChange={setPageRange}
        className="pt-4 pl-1"
      />
    </>
  )
}

export const SearchTable: typeof SearchTableInner = props => (
  <CheckedStateProvider>
    <SearchTableInner {...props} />
  </CheckedStateProvider>
)
