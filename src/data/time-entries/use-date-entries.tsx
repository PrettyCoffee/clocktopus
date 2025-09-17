import { useEffect, useState } from "react"

import { useAtomValue } from "lib/yaasl"

import { getEntriesByDate } from "./get-entries-by-date"

type DateAtom = ReturnType<typeof getEntriesByDate>

const atomCache: Record<string, DateAtom> = {}

export const getDateAtom = (date: string) => {
  if (!atomCache[date]) {
    atomCache[date] = getEntriesByDate(date)
  }
  return atomCache[date]
}

export const useDateEntries = (date: string) => {
  const [atom, setAtom] = useState(() => getDateAtom(date))

  useEffect(() => {
    setAtom(getDateAtom(date))
  }, [date])

  return { entries: useAtomValue(atom), atom }
}
