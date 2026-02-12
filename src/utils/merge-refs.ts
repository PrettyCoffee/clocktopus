import { Ref, RefCallback } from "react"

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

export const mergeRefs = <T>(
  ...refs: (Ref<T> | undefined | null)[]
): RefCallback<T> => {
  if (refs.every(ref => ref == null)) {
    return noop
  }

  return (value: T | null) => {
    refs.forEach(ref => {
      if (typeof ref === "function") {
        ref(value)
      } else if (ref != null) {
        ref.current = value
      }
    })
  }
}
