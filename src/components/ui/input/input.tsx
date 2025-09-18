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
      alert && alertStyles[alert].border,
      "h-10 rounded-md border border-stroke-gentle px-3 text-sm text-text outline-none placeholder:text-text-gentle invalid:border-alert-error focus-visible:border-stroke-focus",
      className
    )}
  />
)
