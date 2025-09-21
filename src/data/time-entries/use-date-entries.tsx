import { useEffect, useState } from "react"

import { useAtomValue } from "lib/yaasl"

import { getDateAtom } from "./get-date-atom"

export const useDateEntries = (date: string) => {
  const [atom, setAtom] = useState(() => getDateAtom(date))

  useEffect(() => {
    setAtom(getDateAtom(date))
  }, [date])

  return { entries: useAtomValue(atom), atom }
}
