import {
  autoSort,
  createSlice,
  indexedDb,
  localStorage,
  sync,
  useAtomValue,
} from "lib/yaasl"

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

const sortDates = (a: string, b: string) => b.localeCompare(a)

const trackedDates = createSlice({
  name: "tracked-dates",
  defaultValue: [] as string[],
  effects: [localStorage(), autoSort({ sortFn: sortDates })],
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
