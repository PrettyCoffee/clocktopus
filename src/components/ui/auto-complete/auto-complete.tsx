import {
  Dispatch,
  PropsWithChildren,
  ReactNode,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import { Slot } from "@radix-ui/react-slot"

import { Button } from "components/ui/button"
import { Portal } from "components/utility/portal"
import { ClassNameProp } from "types/base-props"
import { cn } from "utils/cn"
import { surface } from "utils/styles"
import { zIndex } from "utils/z-index"

const normalize = (text: string) => text.toLowerCase().replaceAll(/\s/g, "")

interface FilterProps<TData>
  extends Pick<
    AutoCompleteProps<TData>,
    "items" | "filter" | "getFilterValue"
  > {
  maxItems: number
}
const filterItems = <TData,>({
  items,
  filter,
  getFilterValue,
  maxItems,
}: FilterProps<TData>) => {
  if (!filter) return []

  const result: TData[] = []
  let index = -1
  while (items[++index] && result.length < maxItems) {
    const item = items[index]!
    if (
      normalize(getFilterValue(item)) !== normalize(filter) &&
      normalize(getFilterValue(item)).includes(normalize(filter))
    ) {
      result.push(item)
    }
  }
  return result
}

const useFocus = (refs: RefObject<Element | null>[]) => {
  const [focus, setFocus] = useState(false)

  useEffect(() => {
    const handler = () => {
      const elements = refs
        .map(({ current }) => current)
        .filter(Boolean) as Element[]

      const target = document.activeElement
      const focus = elements.some(
        element => element === target || element.contains(target)
      )

      setFocus(!!focus)
    }

    window.addEventListener("focusin", handler)
    window.addEventListener("click", handler)

    return () => {
      window.removeEventListener("focusin", handler)
      window.removeEventListener("click", handler)
    }
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, refs)

  return focus
}

const useBoundingRect = () => {
  const [boundingRect, setBoundingRect] =
    useState<ReturnType<Element["getBoundingClientRect"]>>()

  const updateBoundingRect = (element: Element | null) => {
    if (!element) return
    const box = element.getBoundingClientRect()
    if (
      boundingRect &&
      box.left === boundingRect.left &&
      box.bottom === boundingRect.bottom &&
      box.width === boundingRect.width
    ) {
      return
    }
    setBoundingRect(box)
  }

  return { value: boundingRect, update: updateBoundingRect }
}

interface AutoCompleteDropdownProps {
  ref: RefObject<HTMLDivElement | null>
  anchorRect?: DOMRect
}
const AutoCompleteDropdown = ({
  anchorRect,
  ref,
  children,
}: PropsWithChildren<AutoCompleteDropdownProps>) => (
  <Portal>
    <div
      ref={ref}
      className={cn(
        zIndex.popover,
        surface({ look: "overlay", size: "md" }),
        "fixed p-1"
      )}
      style={{
        top: (anchorRect?.bottom ?? 0) + 4,
        left: anchorRect?.left,
        width: anchorRect?.width,
      }}
    >
      {children}
    </div>
  </Portal>
)

interface AutoCompleteProps<TData> extends ClassNameProp {
  items: TData[]
  filter: string
  onSelect: Dispatch<TData>
  getFilterValue: (data: TData) => string
  renderOptionLabel?: (data: TData) => ReactNode
}

export const AutoComplete = <TData,>({
  items: allItems,
  filter,
  getFilterValue,
  onSelect,
  children,
  renderOptionLabel = getFilterValue,
}: PropsWithChildren<AutoCompleteProps<TData>>) => {
  const inputRef = useRef<HTMLElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const focus = useFocus([inputRef, dropdownRef])

  const inputRect = useBoundingRect()

  const items = useMemo(
    () => filterItems({ filter, items: allItems, getFilterValue, maxItems: 5 }),
    [filter, getFilterValue, allItems]
  )

  const open = focus && !!filter && items.length > 0

  return (
    <>
      <Slot
        className="relative"
        ref={element => {
          inputRef.current = element
          inputRect.update(element)
        }}
      >
        {children}
      </Slot>

      {open && (
        <AutoCompleteDropdown ref={dropdownRef} anchorRect={inputRect.value}>
          {items.map(item => (
            <Button
              key={getFilterValue(item)}
              onClick={() => onSelect(item)}
              className="w-full justify-between"
            >
              {renderOptionLabel(item)}
            </Button>
          ))}
        </AutoCompleteDropdown>
      )}
    </>
  )
}
