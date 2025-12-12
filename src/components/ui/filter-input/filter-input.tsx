import { Fragment, useState } from "react"

import { css } from "goober"
import { Search, XCircle } from "lucide-react"

import { cn } from "utils/cn"
import { hstack } from "utils/styles"

import { Input, InputProps } from "../input"
import { Filters, parseFilter, TagConfig } from "./parse-filter"
import { Icon } from "../icon"
import { IconButton } from "../icon-button"

const transparentText = css`
  -webkit-text-fill-color: transparent;
  &::placeholder {
    -webkit-text-fill-color: initial;
  }
`

const textStyles = cn(
  "px-10 text-sm whitespace-nowrap text-text **:whitespace-pre"
)

interface FilterInputProps<TTagName extends string> extends Pick<
  InputProps,
  "placeholder" | "ref" | "style" | "className"
> {
  initialValue?: string
  onChange: (filters: Filters<TTagName>) => void
  tagConfigs: Record<TTagName, TagConfig>
}

export const FilterInput = <TTagName extends string>({
  initialValue = "",
  onChange,
  tagConfigs,
  className,
  ...props
}: FilterInputProps<TTagName>) => {
  const [text, setText] = useState(initialValue)
  const [filter, setFilter] = useState(() =>
    parseFilter(initialValue, tagConfigs)
  )

  const updateText = (newText: string) => {
    if (text === newText) return
    const filter = parseFilter(newText, tagConfigs)

    setText(newText)
    setFilter(filter)
    onChange(filter)
  }

  return (
    <div {...props} className={cn("relative inline-block", className)}>
      <span className="pointer-events-none absolute top-1 bottom-1 left-1 grid size-8 place-items-center">
        <Icon icon={Search} size="sm" color="muted" />
      </span>
      <Input
        type="text"
        value={text}
        onChange={updateText}
        className={cn(transparentText, textStyles, "relative z-1 w-full px-10")}
      />

      <div
        aria-hidden
        className={cn(
          hstack({ align: "center" }),
          textStyles,
          "pointer-events-none absolute inset-0 z-0 ml-px size-full"
        )}
      >
        {filter.segments.map(
          ({ tag, value, text, isTagValid, isValueValid }, index) => (
            <Fragment key={index.toString() + tag + value}>
              {!tag ? (
                <span>{text}</span>
              ) : (
                <span
                  className={cn(
                    "inline-block rounded-[1px] outline-1 outline-offset-1 outline-solid",
                    isTagValid && isValueValid
                      ? "bg-highlight/10 text-highlight outline-highlight/20"
                      : "bg-background outline-stroke-gentle decoration-wavy underline decoration-alert-error"
                  )}
                >
                  {text}
                </span>
              )}
            </Fragment>
          )
        )}
      </div>

      {text && (
        <IconButton
          icon={XCircle}
          size="sm"
          title="Clear filters"
          className="absolute top-1 right-1 bottom-1"
          onClick={() => updateText("")}
        />
      )}
    </div>
  )
}
