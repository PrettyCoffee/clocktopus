import { ChangeEvent, Dispatch, KeyboardEvent, useState } from "react"

import { cn } from "utils/cn"
import { hstack } from "utils/styles"
import { ParsedTime, timeHelpers } from "utils/time-helpers"

import { Input, InputProps } from "../input"

const getNumbers = (value = "") => value.replaceAll(/[^\d]+/g, "")

const padTime = (value: string) => {
  const nums = getNumbers(value)
  switch (nums.length) {
    case 0:
      return "0000"
    case 1:
      return `0${nums}00`
    case 2:
      return `${nums}00`
    case 3:
      return `0${nums}`
    default:
      return nums
  }
}

const clampTime = ({ hours, minutes }: ParsedTime): ParsedTime => {
  if (hours > 23) return { hours: 23, minutes: 59 }
  if (minutes > 59) return { hours, minutes: 59 }
  return { hours, minutes }
}

const forceTime = (value: string) => {
  const padded = padTime(value)
  const parsed = timeHelpers.toParsed(padded)
  const time = clampTime(parsed)
  return timeHelpers.fromParsed(time)
}

const nextQuarter = (timeString: string) => {
  const { hours, minutes } = timeHelpers.toParsed(timeString)
  const snapped = minutes - (minutes % 15) + 15
  const fullMinutes = hours * 60 + snapped
  return forceTime(timeHelpers.fromMinutes(fullMinutes))
}

const prevQuarter = (timeString: string) => {
  const { hours, minutes } = timeHelpers.toParsed(timeString)
  const snapped = minutes - (minutes % 15 || 15)
  const fullMinutes = Math.max(hours * 60 + snapped, 0)
  return forceTime(timeHelpers.fromMinutes(fullMinutes))
}

interface TimeInputProps extends Omit<InputProps, "type" | "onChange"> {
  onChange?: Dispatch<string>
}

export const TimeInput = ({
  onKeyDown,
  onChange,
  onFocus,
  onBlur,
  value,
  className,
  ...props
}: TimeInputProps) => {
  const [text, setText] = useState(getNumbers(value))

  const handleChange = (
    value: string,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const target = event.currentTarget
    const start = target.selectionStart
    const inserted =
      start === 5 ? value.slice(0, 3) + value.slice(4) : value.slice(0, 4)

    setText(inserted)
    onChange?.(forceTime(inserted))
    target.value = inserted
    target.setSelectionRange(start, start)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event)

    const key = event.key
    if (key.length === 1) {
      const isNumber = /\d/.test(event.key)
      if (!isNumber) return event.preventDefault()
      return
    }
    if (key === "ArrowUp") {
      const time = nextQuarter(value ?? "")
      onChange?.(time)
      setText(getNumbers(time))
      event.preventDefault()
      return
    }
    if (key === "ArrowDown") {
      const time = prevQuarter(value ?? "")
      onChange?.(time)
      setText(getNumbers(time))
      event.preventDefault()
      return
    }
  }

  return (
    <div className={cn("relative w-15 rounded-md", className)}>
      <div
        aria-hidden
        className={cn(
          hstack({ align: "center", justify: "center" }),
          "pointer-events-none absolute inset-0 m-auto size-full text-sm [&:has(+input:focus-visible)]:text-transparent"
        )}
      >
        {text.slice(0, 2).padEnd(2, "-")}
        <span className="mx-0.5 font-bold opacity-50">:</span>
        {text.slice(2, 4).padEnd(2, "-")}
      </div>

      <Input
        {...props}
        type="text"
        className="w-full px-0 text-center not-focus-visible:text-transparent"
        value={text}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        onFocus={event => {
          event.currentTarget.focus()
          event.currentTarget.select()
          onFocus?.(event)
        }}
        onBlur={event => {
          setText(getNumbers(value))
          onBlur?.(event)
        }}
      />
    </div>
  )
}
