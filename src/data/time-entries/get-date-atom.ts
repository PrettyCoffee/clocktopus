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
      add: (...entries: TimeEntry[]) => timeEntriesData.actions.add(...entries),
      edit: (id: string, entry: Partial<TimeEntry>) =>
        timeEntriesData.actions.edit({ date, id, data: entry }),
      delete: (id: string) => timeEntriesData.actions.delete({ date, id }),
    },
  })
}
