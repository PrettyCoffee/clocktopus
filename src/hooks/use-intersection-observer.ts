import { RefObject, useEffect, useEffectEvent } from "react"

import { DisableProp } from "types/base-props"

interface UseIntersectionObserverProps extends DisableProp {
  ref: RefObject<HTMLElement | null>
  onIntersection: IntersectionObserverCallback
  options?: IntersectionObserverInit
}

export const useIntersectionObserver = ({
  ref,
  onIntersection,
  options,
  disabled,
}: UseIntersectionObserverProps) => {
  const intersectionEvent = useEffectEvent(onIntersection)

  useEffect(() => {
    if (!ref.current || disabled) return

    const observer = new IntersectionObserver(
      (...args) => intersectionEvent(...args),
      {
        root: options?.root,
        rootMargin: options?.rootMargin,
        threshold: options?.threshold,
      }
    )

    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [disabled, options?.root, options?.rootMargin, options?.threshold, ref])
}
