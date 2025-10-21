import { Dispatch, useState } from "react"

import { ClassNameProp } from "types/base-props"
import { clamp } from "utils/clamp"
import { cn } from "utils/cn"

import { Input } from "../input"

const meassureText = (text: string, reference: HTMLElement) => {
  const element = document.createElement("span")
  element.style.font = window.getComputedStyle(reference).font
  element.style.display = "inline"
  element.style.position = "absolute"
  element.style.opacity = "0"
  element.innerHTML = text
  document.body.appendChild(element)
  const width = element.offsetWidth
  document.body.removeChild(element)
  return width
}

interface ParseNumberOptions {
  min?: number
  max?: number
}
const parseNumber = (
  value: string,
  { min = -Infinity, max = Infinity }: ParseNumberOptions = {}
) => {
  const string = /(-?\d*\.?\d*)/.exec(value)?.[0] ?? ""
  const number = Number.parseFloat(string)

  if (Number.isNaN(number)) {
    return { string, number: undefined }
  }

  const clamped = clamp(number, min, max)
  if (clamped !== number) {
    return { string: String(clamped), number: clamped }
  }

  return {
    string,
    number: Number.parseFloat(string) || undefined,
  }
}

interface NumberInputProps extends ClassNameProp {
  value?: number
  onChange?: Dispatch<number | undefined>
  unit?: string
  id?: string
  placeholder?: string
  max?: number
  min?: number
}
export const NumberInput = ({
  value,
  onChange,
  unit,
  className,
  placeholder = "",
  max,
  min,
  ...delegated
}: NumberInputProps) => {
  const [internal, setInternal] = useState(String(value ?? ""))
  const [unitWidth, setUnitWidth] = useState(0)
  const [digitsWidth, setDigitsWidth] = useState(0)

  const handleChange = (value: string) => {
    const { string, number } = parseNumber(value, { min, max })
    setInternal(string)
    onChange?.(number)
  }

  return (
    <div className="relative w-max">
      <Input
        ref={element => {
          if (!element) return
          setDigitsWidth(
            Math.max(
              meassureText(placeholder, element),
              meassureText(internal, element)
            )
          )
        }}
        {...delegated}
        placeholder={placeholder}
        value={internal}
        onChange={handleChange}
        onBlur={() => setInternal(String(value ?? ""))}
        className={cn(
          "w-[calc(var(--digits)+var(--unit-width)+theme(width.4)+theme(width.4))] pr-[calc(var(--unit-width)+theme(width.4))] text-end",
          className
        )}
        style={{
          // @ts-expect-error ts(2353)
          "--unit-width": `${unitWidth}px`,
          "--digits": `${digitsWidth}px`,
        }}
      />
      <span
        ref={element => {
          if (!element) return
          setUnitWidth(meassureText(unit ?? "", element))
        }}
        className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-text-muted"
      >
        {unit}
      </span>
    </div>
  )
}
