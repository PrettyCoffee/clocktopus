import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useState,
} from "react"

import { TimeEntry } from "data/time-entries"
import { createContext } from "utils/create-context"

const toggle = (state: CheckedState, { date, id }: TimeEntry): CheckedState => {
  if (!state[date]?.[id]) {
    return {
      ...state,
      [date]: { ...state[date], [id]: true },
    }
  }

  const checked = { ...state }

  delete checked[date]?.[id]
  if (Object.keys(checked[date] ?? {}).length === 0) {
    delete checked[date]
  }

  return checked
}

export type CheckedState = Record<string, Record<string, true>>

interface CheckedContextState {
  checked: CheckedState
  onCheckedChange: Dispatch<SetStateAction<CheckedState>>
  toggleChecked: Dispatch<TimeEntry>
  resetChecked: () => void
}

const CheckedContext = createContext<CheckedContextState>("CheckedContext")

export const useCheckedState = () => CheckedContext.useRequiredValue()

const empty = {}

export const CheckedStateProvider = ({ children }: PropsWithChildren) => {
  const [checked, setChecked] = useState<CheckedState>(empty)

  const toggleChecked = useCallback(
    (entry: TimeEntry) => setChecked(state => toggle(state, entry)),
    []
  )

  const resetChecked = useCallback(() => setChecked(empty), [])

  return (
    <CheckedContext
      value={{
        checked,
        onCheckedChange: setChecked,
        resetChecked,
        toggleChecked,
      }}
    >
      {children}
    </CheckedContext>
  )
}
