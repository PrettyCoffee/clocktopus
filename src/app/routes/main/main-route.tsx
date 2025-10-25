import { useMemo, useState } from "react"

import { Ghost } from "lucide-react"

import { ContextInfo } from "components/ui/context-info"
import { timeEntriesData, TimeEntry } from "data/time-entries"
import { selectedWeek } from "features/date-selection"
import {
  CheckedState,
  TimeEntriesBulkActions,
  TimeTable,
} from "features/time-table"
import { CreateTimeEntry } from "features/time-table/create-time-entry"
import { useIntersectionObserver } from "hooks/use-intersection-observer"
import { useAtomValue } from "lib/yaasl"
import { cn } from "utils/cn"
import { dateHelpers } from "utils/date-helpers"
import { vstack } from "utils/styles"

const toggleChecked = (
  state: CheckedState,
  { date, id }: TimeEntry
): CheckedState => {
  if (!state[date]?.[id]) {
    return {
      ...state,
      [date]: { ...state[date], [id]: true },
    }
  }

  const checked = { ...state }

  delete checked[date]?.[id]
  if (Object.keys(checked[date] ?? {}).length === 0) {
    delete checked[date]
  }

  return checked
}

const TimeTables = ({ dates }: { dates: string[] }) => {
  const [checked, setChecked] = useState<CheckedState>({})

  const toggle = (entry: TimeEntry) =>
    setChecked(state => toggleChecked(state, entry))

  return (
    <>
      <TimeEntriesBulkActions
        checked={checked}
        resetChecked={() => setChecked({})}
      />

      <div className="space-y-4">
        {dates.map(date => (
          <TimeTable
            key={date}
            date={date}
            checked={checked[date] ?? {}}
            onCheckedChange={toggle}
          />
        ))}
      </div>
    </>
  )
}

const FirstEntry = () => (
  <div
    className={cn(
      vstack({ align: "center" }),
      "min-h-full w-full px-10 pt-[max(20vh,3rem)] pb-12 mobile:pt-8"
    )}
  >
    <div className="relative size-40">
      <img
        className="absolute -inset-5 min-h-50 min-w-50 opacity-50 blur-3xl"
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

    <h1 className="mb-2 text-3xl">Welcome to Clocktopus!</h1>
    <p className="text-text-gentle">
      Seems like you didn't clock your time yet. Time to change that!
    </p>

    <div className="pt-8" />
    <div className="mx-auto w-full max-w-2xl">
      <CreateTimeEntry />
    </div>
  </div>
)

export const MainRoute = () => {
  const selected = useAtomValue(selectedWeek)
  const trackedDates = useAtomValue(timeEntriesData.selectors.getTrackedDates)
  const visibleDates = useMemo(
    () =>
      selected.days
        .map(dateHelpers.stringify)
        .filter(date => trackedDates.includes(date))
        .reverse(),
    [selected, trackedDates]
  )

  const { ref, isIntersecting } = useIntersectionObserver()

  if (trackedDates.length === 0) return <FirstEntry />

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
        <CreateTimeEntry />
      </div>

      {visibleDates.length === 0 ? (
        <div className="grid w-full flex-1 place-items-center">
          <ContextInfo
            icon={Ghost}
            label="There are no entries in the selected date range yet. Time to add some!"
          />
        </div>
      ) : (
        <div className="flex-1">
          <TimeTables dates={visibleDates} />
        </div>
      )}

      <div className="pb-10" />
    </div>
  )
}
