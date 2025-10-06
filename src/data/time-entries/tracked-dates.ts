import {
  autoSort,
  createEffect,
  createSlice,
  indexedDb,
  useAtomValue,
} from "lib/yaasl"

const dateRegex = /\d{4}-\d{2}-\d{2}/
const loadTrackedDates = createEffect<undefined, string[]>({
  sort: "pre",
  init: async ({ set }) => {
    const allKeys = await indexedDb.getAllKeys()
    const dates = allKeys.filter(key => dateRegex.test(key))
    set(dates)
  },
})

const sortDates = (a: string, b: string) => b.localeCompare(a)

export const trackedDates = createSlice({
  name: "tracked-dates",
  defaultValue: [] as string[],
  effects: [loadTrackedDates(), autoSort({ sortFn: sortDates })],
  reducers: {
    add: (state, date: string) =>
      state.includes(date) ? state : [...state, date],
    remove: (state, date: string) =>
      !state.includes(date) ? state : state.filter(item => item !== date),
  },
})

export const useTrackedDates = () => useAtomValue(trackedDates)
