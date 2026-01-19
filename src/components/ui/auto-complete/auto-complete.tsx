import {
  Dispatch,
  PropsWithChildren,
  ReactNode,
  RefObject,
  useMemo,
  useRef,
  useState,
} from "react"

import { Slot } from "@radix-ui/react-slot"

import { Button } from "components/ui/button"
import { Portal } from "components/utility/portal"
import { useDropdownNavigation } from "hooks/use-dropdown-navigation"
import { useFocus } from "hooks/use-focus"
import { cn } from "utils/cn"
import { fuzzyFilter, FuzzyFilterProps } from "utils/fuzzy-filter"
import { surface } from "utils/styles"
import { zIndex } from "utils/z-index"

const useBoundingRect = () => {
  const [boundingRect, setBoundingRect] =
    useState<ReturnType<Element["getBoundingClientRect"]>>()

  const updateBoundingRect = (element: Element | null) => {
    if (!element) return
    const box = element.getBoundingClientRect()
    if (
      !!boundingRect &&
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

interface AutoCompleteProps<TData> extends FuzzyFilterProps<TData> {
  getId: (data: TData) => string
  onSelect: Dispatch<TData>
  renderOptionLabel?: (data: TData) => ReactNode
}

export const AutoComplete = <TData,>({
  items: allItems,
  filter,
  getFilterValue,
  getId,
  onSelect,
  children,
  renderOptionLabel = getFilterValue,
}: PropsWithChildren<AutoCompleteProps<TData>>) => {
  const inputRef = useRef<HTMLElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const hasFocus = useFocus([inputRef, dropdownRef])

  const inputRect = useBoundingRect()

  const items = useMemo(() => {
    const noExact = allItems.filter(item => getFilterValue(item) !== filter)
    return fuzzyFilter({
      filter,
      items: noExact,
      getFilterValue,
    }).slice(0, 5)
  }, [allItems, filter, getFilterValue])

  const dropdown = useDropdownNavigation({
    triggerRef: inputRef,
    items,
    onSelect,
  })

  const open = hasFocus && !dropdown.forceClose && !!filter

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
          {items.map((item, index) => (
            <Button
              key={getId(item)}
              size="sm"
              onClick={() => onSelect(item)}
              className={cn(
                "w-full justify-between gap-2 truncate text-start",
                index === dropdown.selectedIndex && "bgl-layer-w/10"
              )}
            >
              {renderOptionLabel(item)}
            </Button>
          ))}
        </AutoCompleteDropdown>
      )}
    </>
  )
}
