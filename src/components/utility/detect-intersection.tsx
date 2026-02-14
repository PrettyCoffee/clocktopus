import { Dispatch, useRef } from "react"

import { useIntersectionObserver } from "hooks/use-intersection-observer"
import { DisableProp } from "types/base-props"

interface DetectIntersectionProps extends DisableProp {
  onIntersect: Dispatch<boolean>
  options?: IntersectionObserverInit
}

export const DetectIntersection = ({
  onIntersect,
  options,
  disabled,
}: DetectIntersectionProps) => {
  const intersectionRef = useRef<HTMLDivElement | null>(null)

  useIntersectionObserver({
    ref: intersectionRef,
    onIntersection: ([entry]) => onIntersect(!!entry?.isIntersecting),
    options,
    disabled,
  })

  return <div ref={intersectionRef} />
}
