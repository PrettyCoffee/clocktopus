import { RefObject, useEffect, useEffectEvent } from "react"

interface UseResizeObserverProps {
  ref: RefObject<HTMLElement | null>
  onResize: ResizeObserverCallback
  options?: ResizeObserverOptions
}
export const useResizeObserver = ({
  ref,
  onResize,
  options = {},
}: UseResizeObserverProps) => {
  const callback = useEffectEvent(onResize)

  const { box } = options
  useEffect(() => {
    if (!ref.current) return

    const observer = new ResizeObserver((...args) => callback(...args))
    observer.observe(ref.current, { box })
    return () => observer.disconnect()
  }, [box, ref])
}
