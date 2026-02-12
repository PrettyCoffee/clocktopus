import { PropsWithChildren, useMemo, useState } from "react"

import { t } from "@lingui/core/macro"
import { Trans } from "@lingui/react/macro"
import { Ghost } from "lucide-react"

import { ContextInfo } from "components/ui/context-info"
import { timeEntriesData, TimeEntry } from "data/time-entries"
import { selectedWeek } from "features/date-selection"
import {
  TimeEntriesBulkActions,
  TimeTable,
  CheckedStateProvider,
} from "features/time-table"
import { CreateTimeEntry } from "features/time-table/create-time-entry"
import { useIntersectionObserver } from "hooks/use-intersection-observer"
import { useAtom, createSlice } from "lib/yaasl"
import { cn } from "utils/cn"
import { dateHelpers } from "utils/date-helpers"
import { getLocale } from "utils/get-locale"
import { vstack } from "utils/styles"
import { timeHelpers } from "utils/time-helpers"

const defaultEditableDates: Record<string, true> = {
  [dateHelpers.today()]: true,
}

const editableDates = createSlice({
  name: "locked-dates",
  defaultValue: defaultEditableDates,
  reducers: {
    toggle: (state, date: string) => {
      const { [date]: existing, ...rest } = state
      return existing ? rest : { ...rest, [date]: true }
    },
  },
})

const formatDate = (date: string) => {
  const locale = getLocale()
  if (locale === "iso") {
    const weekday = new Date(date).toLocaleDateString("en", {
      weekday: "short",
    })
    return `${weekday}, ${date}`
  }
  return new Date(date).toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    weekday: "short",
  })
}

const TimeTables = ({ dates }: { dates: string[] }) => {
  const allEntries = useAtom(timeEntriesData)
  const editable = useAtom(editableDates)
  return (
    <CheckedStateProvider>
      <TimeEntriesBulkActions />

      <div className="space-y-4">
        {dates.map(date => (
          <TimeTable
            key={date}
            title={formatDate(date)}
            entries={allEntries[date] ?? []}
            showTotal
            stickyHeader="top-18"
            locked={{
              value: !editable[date],
              onChange: () => editableDates.actions.toggle(date),
            }}
          />
        ))}
      </div>
    </CheckedStateProvider>
  )
}

const FirstEntry = ({ children }: PropsWithChildren) => (
  <div
    className={cn(
      vstack({ align: "center" }),
      "min-h-full w-full px-10 pt-[max(20vh,3rem)] pb-12 mobile:pt-8"
    )}
  >
    <div className="relative size-40">
      <img
        className="absolute -inset-5 min-h-50 min-w-50 opacity-75 blur-3xl"
        src="./octopus-animated.png"
        aria-hidden
        alt=""
      />
      <img
        className="absolute inset-0 z-1 size-full drop-shadow-md"
        src="./octopus-animated.png"
        alt="cute octopus emoji"
      />
    </div>

    <div className="pt-8" />

    <Trans>
      <h1 className="mb-2 text-3xl">Welcome to Clocktopus!</h1>
      <p className="text-text-gentle">
        Seems like you didn't clock your time yet. Time to change that!
      </p>
    </Trans>

    <div className="pt-8" />
    <div className="mx-auto w-full max-w-2xl">{children}</div>
  </div>
)

export const MainRoute = () => {
  const selected = useAtom(selectedWeek)
  const trackedDates = useAtom(timeEntriesData.selectors.getTrackedDates)
  const visibleDates = useMemo(
    () =>
      selected.days
        .map(dateHelpers.stringify)
        .filter(date => trackedDates.includes(date))
        .reverse(),
    [selected, trackedDates]
  )

  const { ref, isIntersecting } = useIntersectionObserver()

  const [latestAdded, setLatestAdded] = useState({
    date: dateHelpers.today(),
    start: timeHelpers.now(),
  })

  const initial = useMemo(() => {
    const weekChanged = !selected.days.some(
      date => dateHelpers.stringify(date) === latestAdded.date
    )
    if (!weekChanged) return latestAdded

    return {
      ...latestAdded,
      date: dateHelpers.stringify(selected.days[0]!),
    }
  }, [latestAdded, selected.days])

  const createTimeEntry = (
    <CreateTimeEntry
      initialDate={initial.date}
      initialTime={initial.start}
      onCreate={(data: TimeEntry) => {
        selectedWeek.actions.selectDate(data.date)
        setLatestAdded({ date: data.date, start: data.end })
      }}
    />
  )

  if (trackedDates.length === 0) {
    return <FirstEntry>{createTimeEntry}</FirstEntry>
  }

  return (
    <div
      key={`${selected.year}-${selected.week}`}
      className="flex min-h-full flex-col px-10"
    >
      <div ref={ref} />
      <div
        className={cn(
          "sticky top-0 rounded-md bg-background-page pt-6",
          !isIntersecting && "z-20 -mx-2 shade-low px-2 pb-2"
        )}
      >
        {createTimeEntry}
      </div>

      {visibleDates.length === 0 ? (
        <div className="grid w-full flex-1 place-items-center">
          <ContextInfo
            icon={Ghost}
            label={t`There are no entries in the selected date range yet. Time to add some!`}
          />
        </div>
      ) : (
        <div className="flex-1 pt-3">
          <TimeTables dates={visibleDates} />
        </div>
      )}

      <div className="pb-10" />
    </div>
  )
}
