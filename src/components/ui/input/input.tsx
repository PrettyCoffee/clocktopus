import { ChangeEvent, Dispatch, KeyboardEvent, FocusEventHandler } from "react"

import {
  AlertKind,
  ClassNameProp,
  DisableProp,
  RefProp,
} from "types/base-props"
import { cn } from "utils/cn"
import { alertStyles } from "utils/styles"

interface TextInputProps {
  type: "text"
  placeholder?: string
}

type PropsByType = TextInputProps

export type InputProps = RefProp<HTMLInputElement> &
  PropsByType &
  ClassNameProp &
  DisableProp & {
    value?: string
    alert?: AlertKind

    onChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void
    onKeyDown?: Dispatch<KeyboardEvent<HTMLInputElement>>
    onFocus?: FocusEventHandler<HTMLInputElement>
    onBlur?: FocusEventHandler<HTMLInputElement>
  }

const handleGridNavigation = (event: KeyboardEvent<HTMLInputElement>) => {
  const { currentTarget: input, key } = event

  const start = input.selectionStart
  const end = input.selectionEnd
  const isFirst = start === end && start === 0
  const isLast = start === end && start === input.value.length

  if ((key === "ArrowLeft" && !isFirst) || (key === "ArrowRight" && !isLast)) {
    event.skipGridNavigation = true
  }
}

export const Input = ({
  ref,
  alert,
  onChange,
  className,
  onKeyDown,
  ...props
}: InputProps) => (
  <input
    ref={ref}
    {...props}
    onChange={event => onChange?.(event.currentTarget.value, event)}
    onKeyDown={event => {
      handleGridNavigation(event)
      onKeyDown?.(event)
    }}
    className={cn(
      "h-10 rounded-md px-3 text-sm text-text outline-none placeholder:text-text-gentle",
      "border border-stroke-gentle invalid:border-alert-error hover:border-stroke focus-visible:border-stroke-focus",
      alert && alertStyles[alert].border,
      className
    )}
  />
)
