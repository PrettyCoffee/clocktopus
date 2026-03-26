import { PropsWithChildren, ReactNode } from "react"

import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { ClassNameProp } from "types/base-props"
import { cn } from "utils/cn"

import { tooltipStyles } from "./tooltip-styles"

export const TooltipProvider = TooltipPrimitive.Provider

interface TooltipProps extends ClassNameProp {
  trigger: ReactNode
  side?: TooltipPrimitive.TooltipContentProps["side"]
  align?: TooltipPrimitive.TooltipContentProps["align"]
  sideOffset?: number
}
export const Tooltip = ({
  trigger,
  side,
  sideOffset = 4,
  align,
  children,
  className,
}: PropsWithChildren<TooltipProps>) => (
  <TooltipPrimitive.Root>
    <TooltipPrimitive.Trigger asChild className={className}>
      {trigger}
    </TooltipPrimitive.Trigger>

    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        side={side}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          tooltipStyles,
          "animate-in fade-in-0 zoom-in-75 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-75",
          className
        )}
      >
        {children}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  </TooltipPrimitive.Root>
)
