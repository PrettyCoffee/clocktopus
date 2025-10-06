import { useMemo } from "react"

import { Atom, createSelector, useAtomValue } from "lib/yaasl"

import { getDateAtom, TimeEntry } from "./get-date-atom"
import { useTrackedDates } from "./tracked-dates"

export const useAllTimeEntries = () => {
  const dates = useTrackedDates()

  const allEntriesAtom = useMemo(() => {
    const dateAtoms = dates.map(getDateAtom) as unknown as [
      Atom<TimeEntry[]>,
      ...Atom<TimeEntry[]>[],
    ]

    return createSelector(dateAtoms, (...dates) => dates.flat())
  }, [dates])

  return useAtomValue(allEntriesAtom)
}
