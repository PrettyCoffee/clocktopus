import { useEffect, useRef, useState } from "react"

import { DisableProp } from "types/base-props"

export const useIntersectionObserver = (
  options?: IntersectionObserverInit & DisableProp
) => {
  const ref = useRef<HTMLDivElement>(null)
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null)

  useEffect(() => {
    const node = ref.current
    if (!node || options?.disabled) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setEntry(entry ?? null)
      },
      {
        root: options?.root,
        rootMargin: options?.rootMargin,
        threshold: options?.threshold,
      }
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [
    options?.disabled,
    options?.root,
    options?.rootMargin,
    options?.threshold,
  ])

  return { ref, entry, isIntersecting: !!entry?.isIntersecting }
}
