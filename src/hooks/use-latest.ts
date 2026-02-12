import { useEffect, useRef } from "react"

export const useLatest = <T>(value: T) => {
  const latest = useRef(value)
  useEffect(() => {
    latest.current = value
  })
  return latest
}
