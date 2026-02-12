import {
  Dispatch,
  Ref,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"

import { t } from "@lingui/core/macro"
import { css } from "goober"
import { Search, XCircle } from "lucide-react"

import { useDropdownNavigation } from "hooks/use-dropdown-navigation"
import { useEventListener } from "hooks/use-event-listener"
import { useFocus } from "hooks/use-focus"
import { useLatest } from "hooks/use-latest"
import { useResizeObserver } from "hooks/use-resize-observer"
import { clamp } from "utils/clamp"
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
  placeholder?: string
  onChange: Dispatch<string>
  id?: string
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
      "absolute inset-0 inset-x-10 -z-1 -ml-px h-full overflow-hidden pl-0.5"
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
  selectedIndex: number
  suggestions: { name: string; example: string }[]
  onSelect: Dispatch<string>
}
const FilterSuggestions = ({
  offsetLeft,
  selectedIndex,
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
    {suggestions.map((item, index) => (
      <Button
        key={item.name}
        className={cn(
          vstack({ align: "start", gap: 0 }),
          "px-2",
          index === selectedIndex && "bgl-layer-w/10"
        )}
        onClick={() => onSelect(item.name)}
      >
        <span className="-my-0.5 text-sm text-text">{item.name}</span>
        <span className="text-xs text-text-muted">e.g. {item.example}</span>
      </Button>
    ))}
  </div>
)

export interface FilterInputProps<TTagName extends string> extends Pick<
  InputProps,
  "placeholder" | "style" | "className"
> {
  id?: string
  value: string
  onChange: (value: string, filters: Filters<TTagName>) => void
  tagConfigs: Record<TTagName, TagConfig>
  hideSuggestions?: boolean
}

export const FilterInput = <TTagName extends string>({
  value: textValue,
  onChange,
  tagConfigs,
  className,
  hideSuggestions,
  id,
  placeholder,
  ...props
}: FilterInputProps<TTagName>) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  const hasFocus = useFocus([wrapperRef])
  const [cursorPos, setCursorPos] = useCursorPos(inputRef)

  const [filter, setFilter] = useState(() => parseFilter(textValue, tagConfigs))
  const lastText = useRef("")

  const changeHandlerRef = useLatest(onChange)
  const updateFilters = useCallback(
    (newText: string) => {
      if (lastText.current === newText) return
      const filter = parseFilter(newText, tagConfigs)

      lastText.current = newText
      setFilter(filter)
      changeHandlerRef.current(newText, filter)
    },
    [changeHandlerRef, tagConfigs]
  )

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- filters must be synced when text value changes
    updateFilters(textValue)
  }, [textValue, updateFilters])

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
      if (textValue.includes(name)) return false
      const currentWord =
        textValue.slice(0, cursorPos.end).split(/\s+/).at(-1) ?? ""
      return name.startsWith(currentWord)
    })

  const insertSuggestion = (suggestion: string) => {
    const beforeCursor = textValue
      .slice(0, cursorPos.start)
      .replace(/[^\s]*$/, suggestion)

    let afterCursor = textValue.slice(cursorPos.end)
    if (afterCursor && !afterCursor.startsWith(" ")) {
      afterCursor = " " + afterCursor
    }

    updateFilters(beforeCursor + afterCursor)

    window.queueMicrotask(() => {
      const newCursorPos = beforeCursor.length
      inputRef.current?.focus()
      inputRef.current?.setSelectionRange(newCursorPos, newCursorPos)
      setCursorPos(newCursorPos)
    })
  }

  const dropdown = useDropdownNavigation({
    triggerRef: inputRef,
    items: suggestions,
    onSelect: ({ name }) => insertSuggestion(name),
  })

  const open = !hideSuggestions && hasFocus && !dropdown.forceClose

  const [scrollLeft, setScrollLeft] = useState(0)
  useEventListener({
    ref: inputRef,
    event: "scroll",
    onEmit: ({ currentTarget }) => {
      if (!(currentTarget instanceof HTMLElement)) return
      setScrollLeft(currentTarget.scrollLeft)
    },
  })

  const [width, setWidth] = useState(0)
  useResizeObserver({
    ref: inputRef,
    onResize: ([entry]) => {
      if (!entry) return
      setWidth(entry.contentRect.width)
    },
  })

  return (
    <div
      {...props}
      ref={wrapperRef}
      className={cn("relative inline-block", className)}
    >
      <span className="pointer-events-none absolute inset-y-1 left-1 grid size-8 place-items-center">
        <Icon icon={Search} size="sm" color="muted" />
      </span>

      <FilterTextInput
        ref={inputRef}
        value={textValue}
        placeholder={placeholder}
        onChange={updateFilters}
        id={id}
      />

      <FilterTextDisplay ref={textRef} segments={filter.segments} />

      {open && (
        <FilterSuggestions
          suggestions={suggestions}
          selectedIndex={dropdown.selectedIndex}
          onSelect={insertSuggestion}
          offsetLeft={clamp(
            measureText(textValue.slice(0, cursorPos.start)) - scrollLeft,
            0,
            width - 32 - 40
          )}
        />
      )}

      {textValue && (
        <IconButton
          icon={XCircle}
          size="sm"
          title={t`Clear filters`}
          className="absolute inset-y-1 right-1"
          onClick={() => updateFilters("")}
        />
      )}
    </div>
  )
}
