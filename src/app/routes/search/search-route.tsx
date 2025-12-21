import { Dispatch, useMemo } from "react"

import { ContextInfo } from "components/ui/context-info"
import { FilterInput } from "components/ui/filter-input"
import { groupedCategories } from "data/categories"
import { timeEntriesData, TimeEntry } from "data/time-entries"
import { useObjectState } from "hooks/use-object-state"
import { useAtomValue } from "lib/yaasl"
import { cn } from "utils/cn"
import { dateHelpers } from "utils/date-helpers"
import { fuzzyFilter } from "utils/fuzzy-filter"
import { vstack } from "utils/styles"

import { SearchTable } from "./search-table"

const sortLatestTop = (a: TimeEntry, b: TimeEntry) => {
  const stampA = `${a.date}_${a.start}_${a.end}`
  const stampB = `${b.date}_${b.start}_${b.end}`
  return stampB.localeCompare(stampA)
}

const isYear = (value: string) => /^\d{4}$/.test(value)

interface Filters {
  description?: string
  category?: string
  year?: string
  fromDate?: string
  untilDate?: string
}

const SearchFilters = ({ onChange }: { onChange: Dispatch<Filters> }) => (
  <FilterInput
    className="block"
    placeholder="Search for time entries"
    onChange={({ text, tags }) => {
      onChange({
        description: text,
        category: tags.category,
        year: tags.year,
        fromDate: tags.from,
        untilDate: tags.until,
      })
    }}
    tagConfigs={{
      category: { example: "Meeting" },
      year: { example: dateHelpers.today().slice(0, 4), validate: isYear },
      until: {
        example: dateHelpers.today(),
        validate: dateHelpers.isValid,
        format: value => {
          if (value.length < 4) return ""
          const date = dateHelpers.parse(
            isYear(value) ? `${value}-12-31` : value
          )
          return dateHelpers.stringify(date)
        },
      },
      from: {
        example: dateHelpers.today(),
        validate: dateHelpers.isValid,
        format: value => {
          if (value.length < 4) return ""
          const date = dateHelpers.parse(
            isYear(value) ? `${value}-01-01` : value
          )
          return dateHelpers.stringify(date)
        },
      },
    }}
  />
)

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
    allFlat,
    filter.description,
    filter.category,
    filter.year,
    filter.fromDate,
    filter.untilDate,
    categories,
  ])

  return (
    <div className={cn(vstack({}), "h-full px-10 pt-6")}>
      <div className="mb-4">
        <SearchFilters onChange={setFilter} />
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
