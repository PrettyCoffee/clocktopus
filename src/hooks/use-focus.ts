import { RefObject, useEffect, useState } from "react"

export const useFocus = (refs: RefObject<Element | null>[]) => {
  const [focus, setFocus] = useState(false)

  useEffect(() => {
    const handler = () => {
      const elements = refs
        .map(({ current }) => current)
        .filter(Boolean) as Element[]

      const target = document.activeElement
      const focus = elements.some(
        element => element === target || element.contains(target)
      )

      setFocus(!!focus)
    }

    window.addEventListener("focusin", handler)
    window.addEventListener("click", handler)

    return () => {
      window.removeEventListener("focusin", handler)
      window.removeEventListener("click", handler)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, refs)

  return focus
}
