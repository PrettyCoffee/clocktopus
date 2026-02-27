import { KeyboardEvent } from "react"

import { css, keyframes } from "goober"
import { Check } from "lucide-react"

import { Icon } from "components/ui/icon"
import { IconProp } from "types/base-props"
import { cn } from "utils/cn"
import { focusNavigator } from "utils/focus-navigator"
import { hstack, interactive } from "utils/styles"

const shiftFocus = (event: KeyboardEvent, x: number) =>
  focusNavigator({
    event,
    cellSelector: "button[role='checkbox']",
    offset: { x, y: 0 },
  })
const eventByKey: Record<string, (event: KeyboardEvent) => void> = {
  ArrowLeft: event => shiftFocus(event, -1),
  ArrowUp: event => shiftFocus(event, -1),
  ArrowRight: event => shiftFocus(event, 1),
  ArrowDown: event => shiftFocus(event, 1),
}
export const checkOptionFocusManager = (event: KeyboardEvent) => {
  if (!Object.keys(eventByKey).includes(event.key)) {
    return
  }
  event.preventDefault()
  eventByKey[event.key]?.(event)
}

const wiggle = keyframes`
  0% {
      rotate: 0deg;
      scale: 0;
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
  animation: 500ms ${wiggle} ease-in-out forwards;
`

interface CheckOptionProps extends Required<IconProp> {
  label: string
  active: boolean
  onClick: () => void
}
export const CheckOption = ({
  active,
  label,
  icon,
  onClick,
}: CheckOptionProps) => (
  <label
    className={cn(
      interactive({ look: "ghost" }),
      hstack({ align: "center", justify: "between", gap: 2 }),
      "h-10 rounded-lg border-stroke-gentle pr-4 pl-2.5"
    )}
  >
    <button
      role="checkbox"
      aria-checked={active}
      onClick={onClick}
      className={cn(
        "relative inline-grid size-5 cursor-pointer place-content-center rounded-sm border-2 border-stroke-gentle",
        active && "border-stroke-invert"
      )}
    >
      {active && (
        <Icon
          icon={Check}
          size="xs"
          strokeWidth={4}
          color="default"
          className={cn(checkAnimation)}
        />
      )}
    </button>
    <Icon icon={icon} size="md" />
    {label}
  </label>
)
