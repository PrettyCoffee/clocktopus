import { useRef, useSyncExternalStore } from "react"

import { reduxDevtools } from "@yaasl/devtools"
import { CONFIG, Stateful } from "@yaasl/react"

import { isDevEnv } from "utils/is-dev-env"

CONFIG.name = "clocktopus"
CONFIG.globalEffects = [reduxDevtools({ disable: !isDevEnv })]

export * from "@yaasl/react"

const stringifyCompare = (a: unknown, b: unknown) => {
  try {
    if (a === b) return true
    if (typeof a !== typeof b) return false
    if (typeof a === "object") {
      return JSON.stringify(a) === JSON.stringify(b)
    }
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    return String(a) === String(b)
  } catch {
    return false
  }
}

export const useSelector = <TState, TResult>(
  atom: Stateful<TState>,
  selector: (state: TState) => TResult,
  compare: (before: TResult, after: TResult) => boolean = stringifyCompare
) => {
  const prev = useRef(undefined as TResult)

  return useSyncExternalStore(
    onStoreChange => atom.subscribe(onStoreChange),
    () => {
      const newValue = selector(atom.get())
      const matches = compare(prev.current, newValue)
      if (matches) return prev.current

      prev.current = newValue
      return newValue
    }
  )
}
