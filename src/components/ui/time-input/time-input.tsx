import { useState } from "react"

import { cn } from "utils/cn"
import { hstack } from "utils/styles"

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

const clampTime = (hours: number, minutes: number): [number, number] => {
  if (hours > 23) return [23, 59]
  if (minutes > 59) return [hours, 59]
  return [hours, minutes]
}

const forceTime = (value: string) => {
  const padded = padTime(value)

  const [hours, minutes] = clampTime(
    Number(padded.slice(0, 2)),
    Number(padded.slice(2, 4))
  )

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
}

export const TimeInput = ({
  onKeyDown,
  onChange,
  onFocus,
  onBlur,
  value,
  className,
  ...props
}: Omit<InputProps, "type">) => {
  const [text, setText] = useState(getNumbers(value))

  return (
    <div className={cn("relative w-15 rounded-md", className)}>
      <div
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
        onKeyDown={event => {
          onKeyDown?.(event)
          if (event.key.length !== 1) return
          const isNumber = /\d/.test(event.key)
          if (!isNumber) return event.preventDefault()
        }}
        onChange={(value, event) => {
          const target = event.currentTarget
          const start = target.selectionStart
          const inserted =
            start === 5 ? value.slice(0, 3) + value.slice(4) : value.slice(0, 4)

          setText(inserted)
          onChange?.(forceTime(inserted), event)
          target.value = inserted
          target.setSelectionRange(start, start)
        }}
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
