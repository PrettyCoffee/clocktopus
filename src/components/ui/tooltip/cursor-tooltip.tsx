import { PropsWithChildren, ReactNode, useState } from "react"

import {
  FloatingPortal,
  offset,
  shift,
  useClientPoint,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
  useTransitionStyles,
} from "@floating-ui/react"

import { Slot } from "components/utility/slot"
import { ClassNameProp } from "types/base-props"
import { cn } from "utils/cn"
import { zIndex } from "utils/z-index"

import { tooltipStyles } from "./tooltip-styles"

interface CursorTooltipProps extends ClassNameProp {
  trigger: ReactNode
}

export const CursorTooltip = ({
  trigger,
  children,
  className,
}: PropsWithChildren<CursorTooltipProps>) => {
  const [open, setOpen] = useState(false)

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    middleware: [offset({ mainAxis: 16, crossAxis: 8 }), shift({ padding: 8 })],
    placement: "bottom-start",
  })

  const { isMounted, styles } = useTransitionStyles(context, {
    initial: { opacity: 0, zoom: 0.75 },
    open: { opacity: 1, zoom: 1 },
    close: { opacity: 0, zoom: 0.75 },
    duration: 150,
  })

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClientPoint(context),
    useHover(context),
    useFocus(context),
    useDismiss(context),
    useRole(context, { role: "tooltip" }),
  ])

  return (
    <>
      <Slot ref={refs.setReference} {...getReferenceProps()}>
        {trigger}
      </Slot>

      {isMounted && (
        <FloatingPortal>
          <div
            // eslint-disable-next-line react-hooks/refs -- false positive
            ref={refs.setFloating}
            style={floatingStyles}
            className={zIndex.tooltip}
            {...getFloatingProps()}
          >
            <div style={styles} className={cn(tooltipStyles, className)}>
              {children}
            </div>
          </div>
        </FloatingPortal>
      )}
    </>
  )
}
