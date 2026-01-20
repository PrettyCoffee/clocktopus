import { useCallback, useEffect, useRef } from "react"

import { t } from "@lingui/core/macro"
import { keyframes } from "goober"
import { X } from "lucide-react"
import { AnimationSequence } from "motion"
import { useAnimate } from "motion/react"

import { Icon } from "components/ui/icon"
import { useTrans } from "locales/locale-provider"
import { cn } from "utils/cn"
import { ease } from "utils/ease"
import { alertStyles, hstack, surface } from "utils/styles"

import { ToastProps } from "./toaster-data"
import { Button } from "../button"
import { IconButton } from "../icon-button"

interface ExtendedToastProps extends ToastProps {
  onClose: (id: string) => void
}

const shrinkTimeBar = keyframes`
  0% {
    left: 0.5rem;
    right: 0.5rem;
    bottom: 0.125rem;
  }
  100% {
    left: 100%;
    right: 0.5rem;
    bottom: 0.125rem;
  }
`

const enterAnimation = (element: HTMLElement): AnimationSequence => [
  [element, { opacity: 0, scale: 0 }, { duration: 0, type: "spring" }],
  [
    element,
    { opacity: 1, scale: 1 },
    { duration: 0.2, type: "spring", bounce: 0.25 },
  ],
]

const exitAnimation = (element: HTMLElement): AnimationSequence => {
  const noSize = { height: 0, width: 0, padding: 0, margin: 0, border: "none" }
  const swipeOut = { opacity: 0, transform: "translateX(100%)" }

  return [
    [element, swipeOut, { duration: 0.2, ease: ease.in }],
    [element, noSize, { at: 0.15, duration: 0.15, ease: ease.bounce }],
  ]
}

export const Toast = ({
  id,
  kind,
  title,
  message,
  actions,
  duration,
  onClose,
}: ExtendedToastProps) => {
  const trans = useTrans()
  const [scope, animate] = useAnimate<HTMLDivElement>()
  const timeout = useRef<Timer | undefined>(undefined)

  useEffect(() => {
    animate(enterAnimation(scope.current))
  }, [animate, scope])

  const exit = useCallback(async () => {
    clearTimeout(timeout.current)
    await animate(exitAnimation(scope.current))
    onClose(id)
  }, [animate, id, onClose, scope])

  useEffect(() => {
    if (duration) {
      timeout.current = setTimeout(() => void exit(), duration)
    }
    return () => clearTimeout(timeout.current)
  }, [duration, exit])

  return (
    <div
      ref={scope}
      className={cn(
        surface({ look: "overlay", size: "md" }),
        "relative my-1 w-screen max-w-96 overflow-hidden border-2 p-1",
        alertStyles[kind].borderGentle
      )}
    >
      <div className={hstack({})}>
        <div className="grid size-10 place-items-center">
          <Icon icon={alertStyles[kind].icon} color={kind} size="lg" />
        </div>
        <div className="my-2 flex-1 overflow-hidden">
          <div className="truncate text-text-priority">
            {typeof title === "string" ? title : trans(title)}
          </div>
          {message && (
            <div className="mt-1 line-clamp-3 text-sm text-text">{message}</div>
          )}
        </div>
        <IconButton
          icon={X}
          title={t`Close message`}
          look="flat"
          onClick={() => void exit()}
        />
      </div>
      {actions && (
        <div
          className={cn(
            hstack({ justify: "end", gap: 2, wrap: true }),
            duration && "pb-2"
          )}
        >
          {actions.map(({ label, ...action }) => {
            const labelText = typeof label === "string" ? label : trans(label)
            return (
              <Button key={labelText} {...action}>
                {labelText}
              </Button>
            )
          })}
        </div>
      )}
      <span
        className={cn("absolute h-0.5 rounded-sm", alertStyles[kind].bg)}
        style={{
          animation: `${shrinkTimeBar} ${duration ?? 0}ms linear forwards`,
        }}
      />
    </div>
  )
}
