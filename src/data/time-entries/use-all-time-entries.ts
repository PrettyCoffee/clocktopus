import { useMemo } from "react"

import { Atom, createSelector, useAtomValue } from "lib/yaasl"

import { getDateAtom, TimeEntry, useTrackedDates } from "./get-date-atom"

export const useAllTimeEntries = () => {
  const dates = useTrackedDates()

  const allEntriesAtom = useMemo(() => {
    const dateAtoms = dates.map(getDateAtom) as unknown as [
      Atom<TimeEntry[]>,
      ...Atom<TimeEntry[]>[],
    ]

    return createSelector(dateAtoms, (...dates) => dates.flat())
  }, [dates])

  console.log(allEntriesAtom.get())

  return useAtomValue(allEntriesAtom)
}
