import { useMemo, useState } from "react"

import { ContextInfo } from "components/ui/context-info"
import { groupedCategories } from "data/categories"
import { timeEntriesData, TimeEntry } from "data/time-entries"
import { useAtomValue } from "lib/yaasl"
import { cn } from "utils/cn"
import { dateHelpers } from "utils/date-helpers"
import { fuzzyFilter } from "utils/fuzzy-filter"
import { vstack } from "utils/styles"

import { SearchFilterInput } from "./fragments/search-filter-input"
import { SearchTable } from "./fragments/search-table"

const sortLatestTop = (a: TimeEntry, b: TimeEntry) => {
  const stampA = `${a.date}_${a.start}_${a.end}`
  const stampB = `${b.date}_${b.start}_${b.end}`
  return stampB.localeCompare(stampA)
}

const useCategoryNames = () => {
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
  return categories
}

interface Filters {
  description?: string
  category?: string
  year?: string
  fromDate?: string
  untilDate?: string
}

const useFilters = (items: TimeEntry[], filter: Filters) => {
  const categories = useCategoryNames()

  return useMemo(() => {
    let filtered = items

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

    if (filter.year) {
      filtered = filtered.filter(({ date }) =>
        dateHelpers.isInRange(
          date,
          `${filter.year}-01-01`,
          `${filter.year}-12-31`
        )
      )
    }

    if (filter.fromDate || filter.untilDate) {
      filtered = filtered.filter(({ date }) =>
        dateHelpers.isInRange(date, filter.fromDate, filter.untilDate)
      )
    }

    return filtered
  }, [
    items,
    filter.description,
    filter.category,
    filter.year,
    filter.fromDate,
    filter.untilDate,
    categories,
  ])
}

export const SearchRoute = () => {
  const raw = useAtomValue(timeEntriesData)
  const allFlat = useMemo(
    () => Object.values(raw).flat().sort(sortLatestTop),
    [raw]
  )

  const [filterText, setFilterText] = useState("")
  const [filter, setFilter] = useState<Filters>({})
  const filtered = useFilters(allFlat, filter)

  return (
    <div className={cn(vstack({}), "h-full px-10 pt-6")}>
      <div className="mb-4">
        <SearchFilterInput
          value={filterText}
          onChange={(value, filters) => {
            setFilterText(value)
            setFilter({
              description: filters.text,
              category: filters.tags.category,
              year: filters.tags.year,
              fromDate: filters.tags.from,
              untilDate: filters.tags.until,
            })
          }}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="grid h-full place-items-center">
          <ContextInfo label="No matches found" />
        </div>
      ) : (
        <SearchTable filtered={filtered} />
      )}

      <div className="pb-8" />
    </div>
  )
}
