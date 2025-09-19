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
interface TimeInputProps {
  type: "time"
  min?: string
  max?: string
  step?: number
}
interface DateInputProps {
  type: "date"
  min?: string
  max?: string
}

type PropsByType = TextInputProps | TimeInputProps | DateInputProps

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

export const Input = ({
  ref,
  alert,
  onChange,
  className,
  ...props
}: InputProps) => (
  <input
    ref={ref}
    {...props}
    onChange={event => onChange?.(event.currentTarget.value, event)}
    className={cn(
      "h-10 rounded-md px-3 text-sm text-text outline-none placeholder:text-text-gentle",
      "border border-stroke-gentle invalid:border-alert-error hover:border-stroke focus-visible:border-stroke-focus",
      alert && alertStyles[alert].border,
      className
    )}
  />
)
