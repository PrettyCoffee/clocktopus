import { ChangeEvent, Dispatch, KeyboardEvent, useState } from "react"

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

const getTime = (value: string): [number, number] => {
  const numbers = getNumbers(value)
  return [Number(numbers.slice(0, 2)), Number(numbers.slice(2, 4))]
}

const clampTime = (hours: number, minutes: number): [number, number] => {
  if (hours > 23) return [23, 59]
  if (minutes > 59) return [hours, 59]
  return [hours, minutes]
}

const twoDigit = (number: number) => number.toString().padStart(2, "0")

const forceTime = (value: string) => {
  const padded = padTime(value)
  const [hours, minutes] = clampTime(...getTime(padded))
  return `${twoDigit(hours)}:${twoDigit(minutes)}`
}

const addMinutes = (time: string, diff: number) => {
  const [hours, minutes] = getTime(time)
  const newTime = Math.max(hours * 60 + minutes + diff, 0)

  const newMinutes = newTime % 60
  const newHours = (newTime - newMinutes) / 60
  return forceTime(`${twoDigit(newHours)}${twoDigit(newMinutes)}`)
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
      const time = addMinutes(value ?? "", 15)
      onChange?.(time)
      setText(getNumbers(time))
      event.preventDefault()
      return
    }
    if (key === "ArrowDown") {
      const time = addMinutes(value ?? "", -15)
      onChange?.(time)
      setText(getNumbers(time))
      event.preventDefault()
      return
    }
  }

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
