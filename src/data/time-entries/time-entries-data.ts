import { z } from "zod"

import { createSlice } from "lib/yaasl"
import { Resolve } from "types/util-types"

import { idbEffect } from "./idb-effect"

export const timeEntrySchema = z.object({
  id: z.number(),
  description: z.string(),
  start: z.string(),
  end: z.string(),
  date: z.string(),
  projectId: z.optional(z.string()),
})
export type TimeEntry = Resolve<z.infer<typeof timeEntrySchema>>

type AtomState = Record<string, TimeEntry[]>

const getNextId = (entries?: TimeEntry[]) =>
  (entries ?? []).reduce((current, { id }) => Math.max(current, id), 0) + 1

const sortEntries = (entries: TimeEntry[]) =>
  entries.toSorted((a, b) => {
    const start = b.start.localeCompare(a.start)
    if (start !== 0) return start
    return b.end.localeCompare(a.end)
  })

export const timeEntriesData = createSlice({
  name: "time-entries",
  defaultValue: {} as AtomState,
  effects: [idbEffect()],

  selectors: {
    getTrackedDates: state => Object.keys(state),
  },

  reducers: {
    add: (state, date: string, ...entries: Omit<TimeEntry, "id">[]) => {
      const nextId = getNextId(state[date])
      const newEntries = [
        ...(state[date] ?? []),
        ...entries.map((entry, index) => ({
          ...entry,
          id: nextId + index,
        })),
      ]
      return { ...state, [date]: sortEntries(newEntries) }
    },

    edit: (state, date: string, id: number, entry: Partial<TimeEntry>) => {
      const newEntries = state[date]?.map(item =>
        item.id !== id ? item : { ...item, ...entry, id }
      )
      if (!newEntries) return state
      return { ...state, [date]: sortEntries(newEntries) }
    },

    delete: (state, date: string, id: number) => {
      const newEntries = (state[date] ?? []).filter(item => item.id != id)
      const newState = { ...state, [date]: newEntries }
      if (newEntries.length === 0) {
        delete newState[date]
      }
      return newState
    },
  },
})
