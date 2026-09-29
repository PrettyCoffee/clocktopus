import { useId, type KeyboardEvent } from "react"

import { Icon } from "components/ui/icon"
import { type IconProp } from "types/base-props"
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
export const radioOptionFocusManager = (event: KeyboardEvent) => {
  if (!Object.keys(eventByKey).includes(event.key)) {
    return
  }
  event.preventDefault()
  eventByKey[event.key]?.(event)
}

interface RadioOptionProps extends Required<IconProp> {
  label: string
  active: boolean
  onClick: () => void
}
export const RadioOption = ({
  active,
  label,
  icon,
  onClick,
}: RadioOptionProps) => {
  const id = useId()
  return (
    <label
      id={id}
      className={cn(
        interactive({ look: "ghost" }),
        hstack({ align: "center", justify: "between", gap: 2 }),
        "border-stroke-gentle h-10 rounded-lg pr-4 pl-2.5",
      )}
    >
      <button
        // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
        role="radio"
        aria-labelledby={id}
        aria-checked={active}
        onClick={onClick}
        className={cn(
          "border-stroke-gentle relative inline-block size-5 rounded-full border-2",
          active &&
            "border-stroke-invert before:bg-stroke-invert before:absolute before:inset-1 before:inline-block before:rounded-full before:transition-[opacity,scale] before:duration-500",
          // oxlint-disable-next-line better-tailwindcss/no-conflicting-classes -- false positive
          "before:starting:scale-50 before:starting:opacity-0",
        )}
      />
      <Icon icon={icon} size="md" />
      {label}
    </label>
  )
}
