import {
  Dispatch,
  PropsWithChildren,
  RefObject,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react"

import { GripHorizontal } from "lucide-react"
import { AnimationSequence, useAnimate } from "motion/react"

import { Icon } from "components/ui/icon"
import { Portal } from "components/utility/portal"
import { clamp } from "utils/clamp"
import { cn } from "utils/cn"
import { mergeRefs } from "utils/merge-refs"
import { surface } from "utils/styles"
import { zIndex } from "utils/z-index"

const useWindowResize = (onResize: () => void) => {
  const handler = useEffectEvent(onResize)

  useEffect(() => {
    window.addEventListener("resize", handler)
    return () => {
      window.removeEventListener("resize", handler)
    }
  }, [handler])
}

const addDragOverlay = () => {
  const dragOverlay = document.createElement("div")
  dragOverlay.className = cn(
    zIndex.dragOverlay,
    "fixed inset-0 h-screen w-screen cursor-grabbing"
  )
  document.body.appendChild(dragOverlay)
  return () => dragOverlay.remove()
}
const useDragging = (
  ref: RefObject<HTMLElement | null>,
  onDrag: Dispatch<MouseEvent>
) => {
  const [moving, setMoving] = useState(false)

  const handler = useEffectEvent(onDrag)

  useEffect(() => {
    const element = ref.current
    if (moving || !element) return

    const mouseDownHandler = () => setMoving(true)
    element.addEventListener("mousedown", mouseDownHandler)
    return () => {
      window.removeEventListener("mousedown", mouseDownHandler)
    }
  }, [moving, ref])

  useEffect(() => {
    if (!moving) return

    const removeDragOverlay = addDragOverlay()
    const mouseUpHandler = () => setMoving(false)

    let frame = 0
    const moveHandler = (event: MouseEvent) => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => handler(event))
    }

    window.addEventListener("mousemove", moveHandler)
    window.addEventListener("mouseup", mouseUpHandler)

    return () => {
      removeDragOverlay()
      window.cancelAnimationFrame(frame)
      window.removeEventListener("mousemove", moveHandler)
      window.removeEventListener("mouseup", mouseUpHandler)
    }
  }, [handler, moving])
}

const clampToWindow = (
  position: Position | null,
  element: HTMLElement | null
) => {
  if (!element || !position) return position
  const rect = element.getBoundingClientRect()

  const off = 8
  const x = clamp(position.x, off, window.innerWidth - rect.width - off)
  const y = clamp(position.y, off, window.innerHeight - rect.height - off)

  const didChange = position.x !== x || position.y !== y
  return didChange ? { x, y } : position
}

interface Position {
  x: number
  y: number
}
interface MovableSnackBarProps {
  initialPosition: (rect: DOMRect) => Position
}

const enterAnimation = (element: HTMLElement): AnimationSequence => [
  [element, { opacity: 0, scale: 0 }, { duration: 0, type: "spring" }],
  [
    element,
    { opacity: 1, scale: 1 },
    { duration: 0.2, type: "spring", bounce: 0.25 },
  ],
]

export const MovableSnackBar = ({
  children,
  initialPosition,
}: PropsWithChildren<MovableSnackBarProps>) => {
  const [scope, animate] = useAnimate<HTMLDivElement>()
  const [position, setPosition] = useState<Position | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    animate(enterAnimation(scope.current))
  }, [animate, scope])

  useWindowResize(() => {
    setPosition(prev => clampToWindow(prev, ref.current))
  })

  useDragging(buttonRef, ({ pageX, pageY }) => {
    const height = ref.current?.getBoundingClientRect().height ?? 0
    const position = {
      x: pageX - height / 2,
      y: pageY - height / 2,
    }
    setPosition(clampToWindow(position, ref.current))
  })

  const initPosition = position
    ? undefined
    : (element: HTMLElement | null) => {
        if (!element) return
        const rect = element.getBoundingClientRect()
        const initial = initialPosition(rect)
        setPosition(clampToWindow(initial, element))
      }

  return (
    <Portal>
      <div
        ref={mergeRefs(initPosition, ref, scope)}
        className={cn(
          surface({ look: "overlay", size: "lg" }),
          zIndex.movableSnackBar,
          "fixed flex p-1"
        )}
        style={{ left: position?.x, top: position?.y }}
      >
        <button
          ref={buttonRef}
          className="grid size-10 cursor-grab place-content-center active:cursor-grabbing"
        >
          <Icon icon={GripHorizontal} color="gentle" size="sm" />
        </button>

        {children}
      </div>
    </Portal>
  )
}
