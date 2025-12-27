import { t } from "@lingui/core/macro"

import { Button } from "components/ui/button"
import { DateInput } from "components/ui/date-input"
import { Divider } from "components/ui/divider"
import { InputLabel } from "components/ui/input-label"
import { timeEntriesData, useTrackedYears } from "data/time-entries"
import { createAtom, createSelector, useAtom } from "lib/yaasl"
import { dateHelpers } from "utils/date-helpers"
import { getLocale } from "utils/get-locale"

interface StatsFilter {
  name: string
  start?: string
  end?: string
}

const allFilter: StatsFilter = { name: "All" }

const createYearFilter = (year: number) => ({
  name: `${year}`,
  start: `${year}-01-01`,
  end: `${year}-12-31`,
})

const statsFilterData = createAtom<StatsFilter>({
  name: "stats-filter",
  defaultValue: allFilter,
})

export const filteredStatsEntries = createSelector(
  [timeEntriesData, statsFilterData],
  (entries, { start, end }) =>
    Object.fromEntries(
      Object.entries(entries).filter(([date]) =>
        dateHelpers.isInRange(date, start, end)
      )
    )
)

export const StatsSideRoute = () => {
  const selectedFilter = useAtom(statsFilterData)
  const entries = useAtom(timeEntriesData)
  const dates = Object.keys(entries)
    .sort()
    .map(date => new Date(date))

  const years = useTrackedYears()

  const matchingEntries = Object.values(useAtom(filteredStatsEntries)).flat()

  const firstEntry = !dates[0] ? undefined : dateHelpers.stringify(dates[0])
  const lastEntry = !dates.at(-1)
    ? undefined
    : dateHelpers.stringify(dates.at(-1)!)

  const predefinedFilters: StatsFilter[] = [
    allFilter,
    ...years.map(createYearFilter),
  ]

  return (
    <div>
      <InputLabel label={t`Predefined Filters`} />
      {predefinedFilters.map(filter => (
        <Button
          key={filter.name}
          onClick={() => statsFilterData.set(filter)}
          active={
            selectedFilter.start === filter.start &&
            selectedFilter.end === filter.end
          }
        >
          {filter.name}
        </Button>
      ))}

      <Divider color="gentle" className="my-4" />

      <InputLabel label={t`Start date`}>
        <DateInput
          locale={getLocale()}
          value={selectedFilter.start ?? firstEntry}
          onChange={start =>
            statsFilterData.set(state => ({ ...state, start, name: t`Custom` }))
          }
          max={dateHelpers.today()}
        />
      </InputLabel>

      <InputLabel label={t`End date`}>
        <DateInput
          locale={getLocale()}
          value={selectedFilter.end ?? lastEntry}
          onChange={end =>
            statsFilterData.set(state => ({ ...state, end, name: t`Custom` }))
          }
          max={dateHelpers.today()}
        />
      </InputLabel>

      <Divider color="gentle" className="my-4" />

      <InputLabel label={t`${matchingEntries.length} Matching time entries`} />
    </div>
  )
}
