import { useCallback, useReducer } from "react"

export const useObjectState = <T extends object>(initialState: T) => {
  const reducer = useCallback(
    (state: T, data: Partial<T>) => ({ ...state, ...data }),
    []
  )
  return useReducer(reducer, initialState)
}
