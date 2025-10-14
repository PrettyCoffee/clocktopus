import { createEffect, indexedDb } from "lib/yaasl"

type StateItem = unknown
type AtomState = Record<string, StateItem[]>

const hash = (text = "") =>
  // eslint-disable-next-line @typescript-eslint/no-misused-spread
  [...text]
    .reduce((out, char) => (101 * out + char.charCodeAt(0)) >>> 0, 11)
    .toString(36)

const convertToHash = (data: unknown) => hash(JSON.stringify(data))

const createHashStore = () => {
  const hashes: Record<string, string> = {}

  return {
    set: (date: string, entries: StateItem[]) =>
      (hashes[date] = convertToHash(entries)),

    getChanged: (state: AtomState) => {
      const allDates = [
        ...new Set([...Object.keys(state), ...Object.keys(hashes)]),
      ]
      return allDates.flatMap(date => {
        const didChange = hashes[date] !== convertToHash(state[date])
        return didChange ? date : []
      })
    },
  }
}

const getStoreSnapshot = async (getKey: (date: string) => string) => {
  const keys = await indexedDb.getAllKeys()
  const atomKeys = keys.filter(key => key.startsWith(getKey("")))

  const state: AtomState = {}
  for (const key of atomKeys) {
    const date = key.replace(getKey(""), "")
    const value = (await indexedDb.get(key)) as StateItem[] | null
    state[date] = value ?? []
  }
  return state
}

export const idbEffect = createEffect<undefined, AtomState>(({ atom }) => {
  const getKey = (date: string) => `${atom.name}/${date}`
  const hashStore = createHashStore()

  return {
    sort: "pre",

    init: async ({ set }) => {
      const existing = (await getStoreSnapshot(getKey)) as AtomState | null
      if (existing == null) return

      Object.entries(existing).forEach(([date, entries]) =>
        hashStore.set(date, entries)
      )

      set(existing)
    },

    set: ({ value }) => {
      const changedDates = hashStore.getChanged(value)
      changedDates.forEach(date => {
        if (!value[date]?.length) {
          void indexedDb.delete(getKey(date))
        } else {
          void indexedDb.set(getKey(date), value[date])
        }
      })
    },
  }
})
