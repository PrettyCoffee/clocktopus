import { z } from "zod/mini"

import { createSlice } from "lib/yaasl"
import { Resolve } from "types/util-types"
import { createId } from "utils/create-id"

import { idbEffect } from "./idb-effect"

export const timeEntrySchema = z.object({
  id: z.string(),
  description: z.string(),
  start: z.string(),
  end: z.string(),
  date: z.string(),
  projectId: z.optional(z.string()),
})
export type TimeEntry = Resolve<z.infer<typeof timeEntrySchema>>

type AtomState = Record<string, TimeEntry[]>

const sortEntries = (entries: TimeEntry[]) =>
  entries.toSorted((a, b) => {
    const start = b.start.localeCompare(a.start)
    if (start !== 0) return start
    return b.end.localeCompare(a.end)
  })

const popEntry = (state: AtomState, date: string, id: string) => {
  const { [date]: entries, ...rest } = state

  const entry = (entries ?? []).find(item => item.id != id)
  const filtered = (entries ?? []).filter(item => item.id != id)

  const newState = filtered.length === 0 ? rest : { ...rest, [date]: filtered }

  return { entry, newState }
}

const popEntries = (
  state: AtomState,
  ...items: Pick<TimeEntry, "date" | "id">[]
) =>
  items.reduce<{ entries: TimeEntry[]; newState: AtomState }>(
    (result, { date, id }) => {
      const { entry, newState } = popEntry(result.newState, date, id)
      if (entry) result.entries.push(entry)

      result.newState = newState
      return result
    },
    { entries: [], newState: state }
  )

const pushEntries = (
  state: AtomState,
  date: string,
  ...entries: TimeEntry[]
) => {
  const oldEntries = state[date] ?? []
  const newEntries = [...oldEntries, ...entries]
  return { ...state, [date]: sortEntries(newEntries) }
}

export const timeEntriesData = createSlice({
  name: "time-entries",
  defaultValue: {} as AtomState,
  effects: [idbEffect()],

  selectors: {
    getTrackedDates: state => Object.keys(state),
  },

  reducers: {
    add: (state, date: string, ...entries: Omit<TimeEntry, "id">[]) => {
      const entriesWithIds = entries.map(entry => ({
        ...entry,
        id: createId("mini"),
      }))

      return pushEntries(state, date, ...entriesWithIds)
    },

    edit: (state, date: string, id: string, entry: Partial<TimeEntry>) => {
      const { entry: oldEntry, newState } = popEntry(state, date, id)
      if (!oldEntry) return state

      const newDate = entry.date ?? date
      return pushEntries(newState, newDate, { ...oldEntry, ...entry, id })
    },

    delete: (state, ...entries: Pick<TimeEntry, "date" | "id">[]) => {
      const { newState } = popEntries(state, ...entries)
      return newState
    },
  },
})
