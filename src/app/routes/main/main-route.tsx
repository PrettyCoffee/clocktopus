import { useMemo, useState } from "react"

import { Ghost, Trash } from "lucide-react"

import { Button } from "components/ui/button"
import { ContextInfo } from "components/ui/context-info"
import { showDialog } from "components/ui/dialog"
import { showToast } from "components/ui/toaster"
import { AutoAnimateHeight } from "components/utility/auto-animate-height"
import { getDateAtom, timeEntriesData, TimeEntry } from "data/time-entries"
import { selectedWeek } from "features/date-selection"
import { TimeTable } from "features/time-table"
import { CreateTimeEntry } from "features/time-table/create-time-entry"
import { useIntersectionObserver } from "hooks/use-intersection-observer"
import { useAtomValue } from "lib/yaasl"
import { cn } from "utils/cn"
import { dateHelpers } from "utils/date-helpers"
import { hstack, vstack } from "utils/styles"

type CheckedState = Record<string, Record<string, true>>

const getSelectedAmount = (checked: CheckedState) =>
  Object.values(checked).reduce(
    (result, checked) => result + Object.keys(checked).length,
    0
  )

const bulkDelete = (checked: CheckedState, onDelete: () => void) =>
  showDialog({
    title: "Delete time entries?",
    description:
      "Do you really want to delete the selected time entries? This action cannot be reverted.",
    confirm: {
      look: "destructive",
      caption: `Delete ${getSelectedAmount(checked)} entries`,
      onClick: () => {
        Object.entries(checked).forEach(([date, checked]) => {
          const atom = getDateAtom(date)
          Object.keys(checked).forEach(id => atom.actions.delete(Number(id)))
        })
        showToast({ kind: "success", title: "Deleted selected entries" })
        onDelete()
      },
    },
  })

const toggleChecked = (state: CheckedState, { date, id }: TimeEntry) => {
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

  const selectedAmount = getSelectedAmount(checked)
  const hasChecked = selectedAmount > 0

  return (
    <>
      <AutoAnimateHeight duration={150}>
        <div
          className={cn(hstack({ align: "center" }), "pt-4 [&:has(*)]:pb-1")}
        >
          {hasChecked && (
            <Button
              icon={Trash}
              onClick={() => bulkDelete(checked, () => setChecked({}))}
            >
              Delete selected
            </Button>
          )}
        </div>
      </AutoAnimateHeight>

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
        src="./octopus.png"
        aria-hidden
        alt=""
      />
      <img
        className="absolute inset-0 z-1 size-full drop-shadow-md"
        src="./octopus.png"
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
      className="flex h-full flex-col px-10"
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
