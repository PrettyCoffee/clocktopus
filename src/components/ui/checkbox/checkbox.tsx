import { Dispatch } from "react"

import * as Primitive from "@radix-ui/react-checkbox"
import { css, keyframes } from "goober"
import { Check, Minus } from "lucide-react"

import { ClassNameProp } from "types/base-props"
import { cn } from "utils/cn"
import { hstack, interactive } from "utils/styles"

import { Icon } from "../icon"

const wiggle = keyframes`
  0% {
      rotate: 0deg;
      scale: 0.1;
  }
  25% {
      rotate: 10deg;
  }
  50% {
    rotate: -10deg;
    scale: 1;
  }
  75% {
      rotate: 10deg;
  }
  100% {
    rotate: 0deg;
  }
`

const checkAnimation = css`
  animation: 300ms ${wiggle} ease-in-out;
`

interface CheckboxProps extends ClassNameProp {
  /** Checked state of the checkbox */
  checked: Primitive.CheckedState
  /** Handler top be called when clicking the checkbox */
  onCheckedChange: Dispatch<boolean>
}

export const Checkbox = ({
  className,
  checked,
  ...delegated
}: CheckboxProps) => (
  <Primitive.Root
    {...delegated}
    checked={checked}
    className={cn(
      interactive({ look: "flat" }),
      hstack({ align: "center", justify: "center" }),
      "relative size-10 shrink-0 rounded-md",
      className
    )}
  >
    <div
      className={cn(
        "absolute size-6 shrink-0 rounded-sm border border-stroke/50 [:hover>&]:border-stroke"
      )}
    />
    <Primitive.Indicator asChild>
      <Icon
        icon={checked === "indeterminate" ? Minus : Check}
        size="xs"
        strokeWidth={4}
        color={checked === "indeterminate" ? "gentle" : "highlight"}
        className={checkAnimation}
      />
    </Primitive.Indicator>
  </Primitive.Root>
)
