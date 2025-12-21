import { useSelector } from "lib/yaasl"

import { timeEntriesData } from "./time-entries-data"

export const useTrackedYears = () =>
  useSelector(timeEntriesData, entries => {
    const years = Object.keys(entries)
      .map(date => date.slice(0, 4))
      .map(Number)

    return [...new Set(years)].sort((a, b) => b - a)
  })
