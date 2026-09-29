import { type PropsWithChildren } from "react"

import { type TooltipContentProps } from "@radix-ui/react-tooltip"
import { type ClassNameProp, type TitleProp } from "types/base-props"

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
    <CursorTooltip className={className} trigger={children}>
      {title}
    </CursorTooltip>
  ) : (
    <Tooltip className={className} trigger={children} side={side}>
      {title}
    </Tooltip>
  )
