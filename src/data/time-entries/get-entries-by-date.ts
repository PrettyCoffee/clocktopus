import {
  autoSort,
  createSlice,
  indexedDb,
  localStorage,
  useAtomValue,
} from "lib/yaasl"

export interface TimeEntry {
  id: number
  description: string
  start: string
  end: string
  date: string
}

const getNextId = (entries: TimeEntry[]) =>
  entries.reduce((current, { id }) => Math.max(current, id), 0) + 1

const trackedDates = createSlice({
  name: "tracked-dates",
  defaultValue: [] as string[],
  effects: [localStorage()],
  reducers: {
    add: (state, date: string) =>
      state.includes(date) ? state : [...state, date],
    remove: (state, date: string) =>
      !state.includes(date) ? state : state.filter(item => item !== date),
  },
})

export const useTrackedDates = () => useAtomValue(trackedDates)

const sortEntries = (a: TimeEntry, b: TimeEntry) => {
  const start = b.start.localeCompare(a.start)
  if (start !== 0) return start
  return b.end.localeCompare(a.end)
}

export const getEntriesByDate = (date: string) => {
  const atom = createSlice({
    name: date,
    defaultValue: [] as TimeEntry[],
    effects: [indexedDb(), autoSort({ sortFn: sortEntries })],
    reducers: {
      add: (state, entry: Omit<TimeEntry, "id">) => [
        ...state,
        { ...entry, id: getNextId(state) },
      ],
      edit: (state, id: number, entry: Partial<TimeEntry>) =>
        state.map(item => (item.id !== id ? item : { ...item, ...entry })),
      remove: (state, entry: TimeEntry) =>
        state.filter(item => item.id !== entry.id),
    },
  })

  atom.subscribe(entries => {
    if (entries.length > 0) {
      trackedDates.actions.add(date)
    } else {
      trackedDates.actions.remove(date)
    }
  })

  return atom
}
