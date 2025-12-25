import { useMemo } from "react"

import { useAtom } from "lib/yaasl"

import { timeEntriesData } from "./time-entries-data"

export const useAllTimeEntries = () => {
  const state = useAtom(timeEntriesData)
  return useMemo(() => Object.values(state).flat(), [state])
}
