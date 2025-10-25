import { Dispatch, PropsWithChildren, SetStateAction, useState } from "react"

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
  checkedByDate: (date: string) => CheckedState[string]
  onCheckedChange: Dispatch<SetStateAction<CheckedState>>
  toggleChecked: Dispatch<TimeEntry>
  resetChecked: () => void
}

const CheckedContext = createContext<CheckedContextState>("CheckedContext")

export const useCheckedState = () => CheckedContext.useRequiredValue()

export const CheckedStateProvider = ({ children }: PropsWithChildren) => {
  const [checked, setChecked] = useState<CheckedState>({})

  const checkedByDate = (date: string) => checked[date] ?? {}

  const toggleChecked = (entry: TimeEntry) =>
    setChecked(state => toggle(state, entry))

  const resetChecked = () => setChecked({})

  return (
    <CheckedContext
      value={{
        checked,
        checkedByDate,
        onCheckedChange: setChecked,
        resetChecked,
        toggleChecked,
      }}
    >
      {children}
    </CheckedContext>
  )
}
