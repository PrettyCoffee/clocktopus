import { useMemo } from "react"

import { useAtomValue } from "lib/yaasl"

import { timeEntriesData } from "./time-entries-data"

export const useAllTimeEntries = () => {
  const state = useAtomValue(timeEntriesData)
  return useMemo(() => Object.values(state).flat(), [state])
}
