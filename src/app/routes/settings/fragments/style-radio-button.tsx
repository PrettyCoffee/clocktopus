import { KeyboardEvent } from "react"

import { Icon } from "components/ui/icon"
import { IconProp } from "types/base-props"
import { cn } from "utils/cn"
import { focusNavigator } from "utils/focus-navigator"
import { hstack, interactive } from "utils/styles"

const shiftFocus = (event: KeyboardEvent, x: number) =>
  focusNavigator({
    event,
    cellSelector: "button[role='radio']",
    offset: { x, y: 0 },
  })
const eventByKey: Record<string, (event: KeyboardEvent) => void> = {
  ArrowLeft: event => shiftFocus(event, -1),
  ArrowUp: event => shiftFocus(event, -1),
  ArrowRight: event => shiftFocus(event, 1),
  ArrowDown: event => shiftFocus(event, 1),
}
export const styleRadioButtonFocusManager = (event: KeyboardEvent) => {
  if (!Object.keys(eventByKey).includes(event.key)) {
    return
  }
  event.preventDefault()
  eventByKey[event.key]?.(event)
}

interface StyleRadioButtonProps extends Required<IconProp> {
  label: string
  active: boolean
  onClick: () => void
}
export const StyleRadioButton = ({
  active,
  label,
  icon,
  onClick,
}: StyleRadioButtonProps) => (
  <label
    className={cn(
      interactive({ look: "ghost" }),
      hstack({ align: "center", justify: "between" }),
      "rounded-lg border-stroke-gentle p-4 pr-5"
    )}
  >
    <button
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={cn(
        "relative inline-block size-5 rounded-full border-2 border-stroke-invert",
        active &&
          "border-highlight before:inline-block before:absolute before:inset-1 before:bg-highlight before:rounded-full"
      )}
    />
    <div className="w-4" />
    <Icon icon={icon} size="lg" />
    <div className="w-2" />
    {label}
  </label>
)
