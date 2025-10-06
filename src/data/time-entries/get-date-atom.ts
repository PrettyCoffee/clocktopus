import { autoSort, createSlice, indexedDb, sync } from "lib/yaasl"

import { trackedDates } from "./tracked-dates"

export interface TimeEntry {
  id: number
  description: string
  start: string
  end: string
  date: string
  project?: string
}

const getNextId = (entries: TimeEntry[]) =>
  entries.reduce((current, { id }) => Math.max(current, id), 0) + 1

const sortEntries = (a: TimeEntry, b: TimeEntry) => {
  const start = b.start.localeCompare(a.start)
  if (start !== 0) return start
  return b.end.localeCompare(a.end)
}

const defaultValue: TimeEntry[] = []

const createEntriesByDate = (date: string) => {
  const atom = createSlice({
    name: date,
    defaultValue,
    effects: [indexedDb(), autoSort({ sortFn: sortEntries }), sync()],
    reducers: {
      add: (state, entry: Omit<TimeEntry, "id">) => [
        ...state,
        { ...entry, id: getNextId(state) },
      ],

      edit: (state, id: number, entry: Partial<TimeEntry>) =>
        state.map(item => (item.id !== id ? item : { ...item, ...entry })),

      delete: (state, id: number) => {
        const newState = state.filter(item => item.id != id)
        return newState.length === 0 ? defaultValue : newState
      },
    },
  })

  atom.subscribe(entries => {
    if (trackedDates.didInit !== true) return
    if (entries.length > 0) {
      trackedDates.actions.add(date)
    } else {
      trackedDates.actions.remove(date)
    }
  })

  return atom
}

const atomsCache: Record<string, ReturnType<typeof createEntriesByDate>> = {}

export const getDateAtom = (date: string) => {
  if (!atomsCache[date]) {
    atomsCache[date] = createEntriesByDate(date)
  }
  return atomsCache[date]
}
