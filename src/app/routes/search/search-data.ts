import { createAtom, createSlice, indexedDb } from "lib/yaasl"
import { createId } from "utils/create-id"

export const searchText = createAtom({
  name: "search-text",
  defaultValue: "",
})

export interface Filter {
  id: string
  name: string
  value: string
}

export const savedFilters = createSlice({
  name: "search-filters",
  defaultValue: [] as Filter[],
  effects: [indexedDb()],
  reducers: {
    add: (state, filter: Omit<Filter, "id">) => [
      ...state,
      { ...filter, id: createId("mini") },
    ],
    edit: (state, id: string, data: Partial<Filter>) =>
      state.map(filter => (filter.id !== id ? filter : { ...filter, ...data })),
    delete: (state, id: string) => state.filter(filter => filter.id !== id),
  },
})
