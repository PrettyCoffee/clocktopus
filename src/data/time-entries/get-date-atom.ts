import { createDerived } from "lib/yaasl"

import { timeEntriesData, TimeEntry } from "./time-entries-data"

export const getDateAtom = (date: string) => {
  const atom = createDerived(
    ({ get }) => get(timeEntriesData)[date] ?? [],
    ({ set, value }) =>
      set(timeEntriesData, state => ({ ...state, [date]: value }))
  )

  return Object.assign(atom, {
    actions: {
      add: (...entries: TimeEntry[]) =>
        timeEntriesData.actions.add(date, ...entries),
      edit: (id: number, entry: Partial<TimeEntry>) =>
        timeEntriesData.actions.edit(date, id, entry),
      delete: (id: number) => timeEntriesData.actions.delete(date, id),
    },
  })
}
