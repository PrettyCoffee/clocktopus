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
type DateAndId = Pick<TimeEntry, "date" | "id">

type AtomState = Record<string, TimeEntry[]>

const sortEntries = (entries: TimeEntry[]) =>
  entries.toSorted((a, b) => {
    const start = b.start.localeCompare(a.start)
    if (start !== 0) return start
    return b.end.localeCompare(a.end)
  })

const popEntry = (state: AtomState, date: string, id: string) => {
  const { [date]: entries, ...rest } = state

  const entry = (entries ?? []).find(item => item.id === id)
  const filtered = (entries ?? []).filter(item => item.id !== id)

  const newState = filtered.length === 0 ? rest : { ...rest, [date]: filtered }

  return { entry, newState }
}

const popEntries = (state: AtomState, ...items: DateAndId[]) =>
  items.reduce<{ entries: TimeEntry[]; newState: AtomState }>(
    (result, { date, id }) => {
      const { entry, newState } = popEntry(result.newState, date, id)
      if (entry) result.entries.push(entry)

      result.newState = newState
      return result
    },
    { entries: [], newState: state }
  )

const pushEntries = (state: AtomState, ...entries: TimeEntry[]) =>
  entries.reduce((result, entry) => {
    const oldEntries = result[entry.date] ?? []
    const newEntries = [...oldEntries, entry]
    return { ...result, [entry.date]: sortEntries(newEntries) }
  }, state)

export const timeEntriesData = createSlice({
  name: "time-entries",
  defaultValue: {} as AtomState,
  effects: [idbEffect()],

  selectors: {
    getTrackedDates: state => Object.keys(state),
  },

  reducers: {
    add: (state, ...entries: Omit<TimeEntry, "id">[]) => {
      const entriesWithIds = entries.map(entry => ({
        ...entry,
        id: createId("mini"),
      }))

      return pushEntries(state, ...entriesWithIds)
    },

    edit: (state, ...items: (DateAndId & { data: Partial<TimeEntry> })[]) => {
      const { entries: oldEntries, newState } = popEntries(state, ...items)
      if (oldEntries.length === 0) return state

      const entries = oldEntries.map(oldEntry => {
        const { data } = items.find(entry => entry.id === oldEntry.id) ?? {}
        return { ...oldEntry, ...data }
      })
      return pushEntries(newState, ...entries)
    },

    delete: (state, ...entries: DateAndId[]) => {
      const { newState } = popEntries(state, ...entries)
      return newState
    },
  },
})
