import { useEffect, useMemo, useState } from "react"

import { ContextInfo } from "components/ui/context-info"
import { FilterInput } from "components/ui/filter-input"
import { PageRange, Pagination } from "components/ui/pagination"
import { groupedCategories } from "data/categories"
import { timeEntriesData, TimeEntry } from "data/time-entries"
import {
  CheckedStateProvider,
  TimeEntriesBulkActions,
  TimeTable,
  useCheckedState,
} from "features/time-table"
import { useObjectState } from "hooks/use-object-state"
import { useAtomValue } from "lib/yaasl"
import { cn } from "utils/cn"
import { dateHelpers } from "utils/date-helpers"
import { fuzzyFilter } from "utils/fuzzy-filter"
import { vstack } from "utils/styles"

const pageSizes = [10, 15, 20, 25, 30] as const satisfies number[]
const initialPageSize = 15 as const

const SearchTable = ({ filtered }: { filtered: TimeEntry[] }) => {
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
          title={`Search Results (${filtered.length})`}
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

const sortLatestTop = (a: TimeEntry, b: TimeEntry) => {
  const stampA = `${a.date}_${a.start}_${a.end}`
  const stampB = `${b.date}_${b.start}_${b.end}`
  return stampB.localeCompare(stampA)
}

interface Filters {
  description?: string
  category?: string
  fromDate?: string
  untilDate?: string
}

export const SearchRoute = () => {
  const raw = useAtomValue(timeEntriesData)
  const allFlat = useMemo(
    () => Object.values(raw).flat().sort(sortLatestTop),
    [raw]
  )
  const groups = useAtomValue(groupedCategories)
  const categories = useMemo(
    () =>
      Object.fromEntries([
        ["", "No category"],
        ...groups.flatMap(({ name: groupName, categories }) =>
          categories.map(
            ({ id, name }) =>
              [id, [groupName, name].filter(Boolean).join(" - ")] as const
          )
        ),
      ]),
    [groups]
  )

  const [filter, setFilter] = useObjectState<Filters>({})

  const filtered = useMemo(() => {
    let filtered = allFlat

    if (filter.category) {
      filtered = fuzzyFilter({
        items: filtered,
        filter: filter.category ?? "",
        getFilterValue: item => categories[item.categoryId ?? ""] ?? "",
      })
    }

    if (filter.description) {
      filtered = fuzzyFilter({
        items: filtered,
        filter: filter.description,
        getFilterValue: item => item.description,
      })
    }

    if (filter.fromDate || filter.untilDate) {
      filtered = filtered.filter(({ date }) =>
        dateHelpers.isInRange(date, filter.fromDate, filter.untilDate)
      )
    }

    return filtered
  }, [
    allFlat,
    filter.category,
    filter.description,
    filter.fromDate,
    filter.untilDate,
    categories,
  ])

  return (
    <div className={cn(vstack({}), "h-full px-10 pt-6")}>
      <div className="mb-4">
        <FilterInput
          className="block"
          placeholder="Search for time entries"
          onChange={({ text, tags }) => {
            setFilter({
              description: text,
              category: tags.category,
              fromDate: tags.from,
              untilDate: tags.until,
            })
          }}
          tagConfigs={{
            category: {},
            until: {
              validate: value => value.length < 4 || dateHelpers.isValid(value),
              format: value => {
                if (value.length < 4) return ""
                const isYear = /^\d{4}$/.test(value)
                const date = dateHelpers.parse(
                  isYear ? `${value}-12-31` : value
                )
                return dateHelpers.stringify(date)
              },
            },
            from: {
              validate: value => value.length < 4 || dateHelpers.isValid(value),
              format: value => {
                if (value.length < 4) return ""
                const isYear = /^\d{4}$/.test(value)
                const date = dateHelpers.parse(
                  isYear ? `${value}-01-01` : value
                )
                return dateHelpers.stringify(date)
              },
            },
          }}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="grid h-full place-items-center">
          <ContextInfo label="No matches found" />
        </div>
      ) : (
        <CheckedStateProvider>
          <SearchTable filtered={filtered} />
        </CheckedStateProvider>
      )}

      <div className="pb-8" />
    </div>
  )
}
