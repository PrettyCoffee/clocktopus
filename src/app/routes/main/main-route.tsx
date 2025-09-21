import { Trash } from "lucide-react"

import { Button } from "components/ui/button"
import { showDialog } from "components/ui/dialog"
import { showToast } from "components/ui/toaster"
import { AutoAnimateHeight } from "components/utility/auto-animate-height"
import { getDateAtom, TimeEntry, useTrackedDates } from "data/time-entries"
import { TimeTable } from "features/time-table"
import { CreateTimeEntry } from "features/time-table/create-time-entry"
import { useIntersectionObserver } from "hooks/use-intersection-observer"
import { createSlice, useAtomValue } from "lib/yaasl"
import { cn } from "utils/cn"
import { hstack, vstack } from "utils/styles"

type CheckedState = Record<string, Record<string, true>>
const checkedRows = createSlice({
  defaultValue: {} as CheckedState,
  reducers: {
    toggle: (state, { date, id }: TimeEntry) => {
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
    },
  },
})

const getSelectedAmount = (checked: CheckedState) =>
  Object.values(checked).reduce(
    (result, checked) => result + Object.keys(checked).length,
    0
  )

const bulkDelete = (checked: CheckedState) =>
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
        checkedRows.set({})
        showToast({ kind: "success", title: "Deleted selected entries" })
      },
    },
  })

const FirstEntry = () => (
  <div
    className={cn(
      vstack({ align: "center" }),
      "size-full px-10 pt-[20vh] mobile:pt-8"
    )}
  >
    <img
      className="size-40 rounded-lg opacity-50 shade-medium"
      src="./clocktopus.png"
      alt="logo"
    />

    <div className="pt-8" />

    <h1 className="mb-2 text-3xl">Welcome to Clocktopus! 🐙</h1>
    <p className="text-text-gentle">
      Seems like you didn't clock your time yet. Time to change that!
    </p>

    <div className="pt-8" />
    <div className="mx-auto w-full max-w-2xl">
      <CreateTimeEntry />
    </div>
  </div>
)

const MainRoute = () => {
  const trackedDates = useTrackedDates()
  const { ref, isIntersecting } = useIntersectionObserver()
  const checked = useAtomValue(checkedRows)

  const selectedAmount = getSelectedAmount(checked)
  const hasChecked = selectedAmount > 0

  if (trackedDates.length === 0) return <FirstEntry />

  return (
    <div className="px-10">
      <div ref={ref} />
      <div
        className={cn(
          "sticky top-0 rounded-md bg-background-page pt-6",
          !isIntersecting && "z-20 -mx-2 shade-low px-2 pb-2"
        )}
      >
        <CreateTimeEntry />
      </div>

      <AutoAnimateHeight duration={150}>
        <div
          className={cn(hstack({ align: "center" }), "pt-4 [&:has(*)]:pb-1")}
        >
          {hasChecked && (
            <Button icon={Trash} onClick={() => bulkDelete(checked)}>
              Delete selected
            </Button>
          )}
        </div>
      </AutoAnimateHeight>

      <div className="space-y-4">
        {trackedDates.map(date => (
          <TimeTable
            key={date}
            date={date}
            checked={checked[date] ?? {}}
            onCheckedChange={entry => checkedRows.actions.toggle(entry)}
          />
        ))}
      </div>

      <div className="pb-10" />
    </div>
  )
}

export default MainRoute
