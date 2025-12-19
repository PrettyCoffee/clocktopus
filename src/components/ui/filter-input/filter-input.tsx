import {
  Dispatch,
  Ref,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"

import { css } from "goober"
import { Search, XCircle } from "lucide-react"

import { useFocus } from "hooks/use-focus"
import { cn } from "utils/cn"
import { hstack, surface, vstack } from "utils/styles"
import { zIndex } from "utils/z-index"

import { Input, InputProps } from "../input"
import {
  EnrichedFilterItem,
  Filters,
  parseFilter,
  TagConfig,
} from "./parse-filter"
import { Button } from "../button"
import { Icon } from "../icon"
import { IconButton } from "../icon-button"

const transparentText = css`
  -webkit-text-fill-color: transparent;
  &::placeholder {
    -webkit-text-fill-color: initial;
  }
`

const textStyles = cn("text-sm whitespace-pre text-text **:whitespace-pre")

const measureText = (text: string) => {
  const span = document.createElement("span")
  span.innerText = text
  span.className = textStyles
  document.body.appendChild(span)
  const width = span.offsetWidth
  span.remove()
  return width
}

const useCursorPos = (ref: RefObject<HTMLInputElement | null>) => {
  const [cursorPos, setCursorPos] = useState({ start: 0, end: 0 })

  const updateCursorPos = useCallback(
    (value: number | { start: number; end: number }) => {
      const { start, end } =
        typeof value === "number" ? { start: value, end: value } : value

      setCursorPos(prev => {
        const didChange = start !== prev.start || end !== prev.end
        return !didChange ? prev : { start, end }
      })
    },
    []
  )

  useEffect(() => {
    const input = ref.current
    if (!input) return

    const handler = () => {
      const { selectionStart, selectionEnd } = input
      const start = selectionStart ?? selectionEnd ?? 0
      const end = selectionEnd ?? selectionStart ?? 0
      updateCursorPos({ start, end })
    }

    input.addEventListener("keydown", handler)
    input.addEventListener("keyup", handler)
    input.addEventListener("mouseup", handler)

    return () => {
      input.removeEventListener("keydown", handler)
      input.removeEventListener("keyup", handler)
      input.removeEventListener("mouseup", handler)
    }
  }, [ref, updateCursorPos])

  return [cursorPos, updateCursorPos] as const
}

interface FilterTextInputProps {
  ref: Ref<HTMLInputElement>
  value: string
  onChange: Dispatch<string>
}
const FilterTextInput = ({
  ref,
  value,
  onChange,
  ...props
}: FilterTextInputProps) => (
  <Input
    {...props}
    ref={ref}
    type="text"
    value={value}
    onChange={onChange}
    className={cn(transparentText, textStyles, "relative w-full px-10")}
  />
)

interface FilterTextDisplayProps {
  ref: Ref<HTMLDivElement>
  segments: EnrichedFilterItem[]
}
const FilterTextDisplay = ({ ref, segments }: FilterTextDisplayProps) => (
  <div
    ref={ref}
    aria-hidden
    className={cn(
      hstack({ align: "center" }),
      textStyles,
      "absolute inset-0 right-10 left-10 -z-1 ml-px h-full overflow-hidden"
    )}
  >
    {segments.map(({ tag, value, text, isTagValid, isValueValid }, index) =>
      !tag ? (
        // eslint-disable-next-line react/no-array-index-key
        <span key={`${value}-${index}`}>{text}</span>
      ) : (
        <span
          // eslint-disable-next-line react/no-array-index-key
          key={`${value}-${tag}-${index}`}
          className={cn(
            "inline-block rounded-[1px] outline-1 outline-offset-1 outline-solid",
            isTagValid && isValueValid
              ? "bg-highlight/10 text-highlight outline-highlight/20"
              : "bg-background outline-stroke-gentle decoration-wavy underline decoration-alert-error"
          )}
        >
          {text}
        </span>
      )
    )}
  </div>
)

interface FilterSuggestions {
  offsetLeft: number
  suggestions: { name: string; example: string }[]
  onSelect: Dispatch<string>
}
const FilterSuggestions = ({
  offsetLeft,
  suggestions,
  onSelect,
}: FilterSuggestions) => (
  <div
    className={cn(
      surface({ size: "md", look: "overlay" }),
      vstack(),
      zIndex.popover,
      "absolute top-11 left-8 p-0 transition-transform duration-200 ease-out"
    )}
    style={{
      translate: offsetLeft,
    }}
  >
    {suggestions.map(item => (
      <Button
        key={item.name}
        className={cn(vstack({ align: "start", gap: 0 }), "px-2")}
        onClick={() => onSelect(item.name)}
      >
        <span className="-my-0.5 text-sm text-text">{item.name}</span>
        <span className="text-xs text-text-muted">e.g. {item.example}</span>
      </Button>
    ))}
  </div>
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
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  const hasFocus = useFocus([wrapperRef])
  const [cursorPos, setCursorPos] = useCursorPos(inputRef)

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

  useEffect(() => {
    const input = inputRef.current
    if (!input) return

    const syncScroll = () => {
      const text = textRef.current
      const input = inputRef.current
      if (!text || !input) return
      text.scrollLeft = input.scrollLeft
    }

    input.addEventListener("scroll", syncScroll)
    return () => input.removeEventListener("scroll", syncScroll)
  }, [])

  const suggestions = Object.keys(tagConfigs)
    .map(tag => ({
      name: `${tag}:`,
      example: tagConfigs[tag as TTagName].example,
    }))
    .filter(({ name }) => {
      if (text.includes(name)) return false
      const currentWord = text.slice(0, cursorPos.end).split(/\s+/).at(-1) ?? ""
      return name.startsWith(currentWord)
    })

  const insertSuggestion = (suggestion: string) => {
    const beforeCursor = text
      .slice(0, cursorPos.start)
      .replace(/[^\s]*$/, suggestion)

    let afterCursor = text.slice(cursorPos.end)
    if (afterCursor && !afterCursor.startsWith(" ")) {
      afterCursor = " " + afterCursor
    }

    updateText(beforeCursor + afterCursor)

    window.queueMicrotask(() => {
      const newCursorPos = beforeCursor.length
      inputRef.current?.focus()
      inputRef.current?.setSelectionRange(newCursorPos, newCursorPos)
      setCursorPos(newCursorPos)
    })
  }

  return (
    <div
      {...props}
      ref={wrapperRef}
      className={cn("relative inline-block", className)}
    >
      <span className="pointer-events-none absolute top-1 bottom-1 left-1 grid size-8 place-items-center">
        <Icon icon={Search} size="sm" color="muted" />
      </span>

      <FilterTextInput ref={inputRef} value={text} onChange={updateText} />

      <FilterTextDisplay ref={textRef} segments={filter.segments} />

      {hasFocus && suggestions.length > 0 && (
        <FilterSuggestions
          suggestions={suggestions}
          onSelect={insertSuggestion}
          offsetLeft={(() => {
            const scroll = textRef.current?.scrollLeft ?? 0
            return measureText(text.slice(0, cursorPos.start)) - scroll
          })()}
        />
      )}

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
