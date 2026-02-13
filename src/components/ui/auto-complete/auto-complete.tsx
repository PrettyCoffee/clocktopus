import {
  Dispatch,
  PropsWithChildren,
  ReactNode,
  RefObject,
  useMemo,
  useRef,
  useState,
} from "react"

import { Button } from "components/ui/button"
import { Portal } from "components/utility/portal"
import { Slot } from "components/utility/slot"
import { useDropdownNavigation } from "hooks/use-dropdown-navigation"
import { useEventListener } from "hooks/use-event-listener"
import { useFocus } from "hooks/use-focus"
import { cn } from "utils/cn"
import { fuzzyFilter, FuzzyFilterProps } from "utils/fuzzy-filter"
import { mergeRefs } from "utils/merge-refs"
import { surface } from "utils/styles"
import { zIndex } from "utils/z-index"

const useBoundingRect = () => {
  const windowRef = useRef(window)
  const ref = useRef<HTMLElement | null>(null)

  const [boundingRect, setBoundingRect] =
    useState<ReturnType<Element["getBoundingClientRect"]>>()

  const updateBoundingRect = () => {
    const element = ref.current
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

  useEventListener({
    ref: windowRef,
    event: "resize",
    onEmit: updateBoundingRect,
  })

  const setRef = (element: HTMLElement | null) => {
    ref.current = element
    updateBoundingRect()
  }

  return {
    setRef,
    value: boundingRect,
    update: updateBoundingRect,
  }
}

interface AutoCompleteDropdownProps {
  ref: RefObject<HTMLDivElement | null>
  anchorRect?: DOMRect | null
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
        "fixed max-h-48 overflow-auto p-1"
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
    }).slice(0, 10)
  }, [allItems, filter, getFilterValue])

  const dropdown = useDropdownNavigation({
    triggerRef: inputRef,
    items,
    onSelect,
  })

  const open = hasFocus && !dropdown.forceClose && !!filter

  return (
    <>
      <Slot className="relative" ref={mergeRefs(inputRef, inputRect.setRef)}>
        {children}
      </Slot>

      {open && (
        <AutoCompleteDropdown ref={dropdownRef} anchorRect={inputRect.value}>
          {items.map((item, index) => {
            const isSelected = index === dropdown.selectedIndex
            return (
              <Button
                key={getId(item)}
                ref={ref => {
                  if (isSelected)
                    ref?.scrollIntoView({ behavior: "smooth", block: "center" })
                }}
                size="sm"
                onClick={() => onSelect(item)}
                className={cn(
                  "w-full justify-between gap-2 truncate text-start",
                  isSelected && "bgl-layer-w/10"
                )}
              >
                {renderOptionLabel(item)}
              </Button>
            )
          })}
        </AutoCompleteDropdown>
      )}
    </>
  )
}
