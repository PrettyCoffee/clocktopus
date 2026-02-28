import { PropsWithChildren } from "react"

import { TooltipContentProps } from "@radix-ui/react-tooltip"

import { ClassNameProp, TitleProp } from "types/base-props"

import { CursorTooltip } from "./cursor-tooltip"
import { Tooltip } from "./tooltip"

export interface TitleTooltipProps extends TitleProp, ClassNameProp {
  side?: TooltipContentProps["side"]
}
export const TitleTooltip = ({
  title,
  side,
  children,
  className,
}: PropsWithChildren<TitleTooltipProps>) =>
  !title ? (
    children
  ) : !side ? (
    <CursorTooltip className={className} title={title}>
      {children}
    </CursorTooltip>
  ) : (
    <Tooltip className={className} content={title} side={side}>
      {children}
    </Tooltip>
  )
