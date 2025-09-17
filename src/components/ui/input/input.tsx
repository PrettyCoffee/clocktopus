import { Dispatch } from "react"

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

    onChange?: Dispatch<string>
    onKeyDown?: Dispatch<string>
    onFocus?: () => void
    onBlur?: () => void
  }

export const Input = ({
  ref,
  alert,
  onChange,
  onKeyDown,
  className,
  ...props
}: InputProps) => (
  <input
    ref={ref}
    {...props}
    onChange={({ currentTarget }) => onChange?.(currentTarget.value)}
    onKeyDown={({ key }) => onKeyDown?.(key)}
    className={cn(
      alert && alertStyles[alert].border,
      "h-10 rounded-md border border-stroke-gentle bg-background-page px-3 text-sm text-text outline-none placeholder:text-text-gentle invalid:border-alert-error focus-visible:border-stroke-focus",
      className
    )}
  />
)
