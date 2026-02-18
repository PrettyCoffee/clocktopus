import { PropsWithChildren } from "react"

import { TooltipContentProps } from "@radix-ui/react-tooltip"

import { AsChildProp, ClassNameProp, TitleProp } from "types/base-props"

import { Tooltip } from "./tooltip"

export interface TitleTooltipProps
  extends TitleProp, AsChildProp, ClassNameProp {
  side?: TooltipContentProps["side"]
  force?: boolean
}
export const TitleTooltip = ({
  title,
  asChild,
  side,
  children,
  force,
  className,
}: PropsWithChildren<TitleTooltipProps>) =>
  !title ? (
    children
  ) : (
    <Tooltip.Root open={force}>
      <Tooltip.Trigger asChild={asChild} className={className}>
        {children}
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content side={side}>{title}</Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  )
