import { useMemo } from "react"

import { getDateAtom } from "./get-date-atom"

export const useDateEntries = (date: string) => {
  const atom = useMemo(() => getDateAtom(date), [date])
  return atom
}
