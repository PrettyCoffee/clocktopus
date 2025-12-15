import {
  Dispatch,
  KeyboardEvent,
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
import { useFocus } from "hooks/use-focus"
import { ClassNameProp } from "types/base-props"
import { cn } from "utils/cn"
import { fuzzyFilter } from "utils/fuzzy-filter"
import { surface } from "utils/styles"
import { zIndex } from "utils/z-index"

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
  const [selection, setSelection] = useState(0)

  const [forceClose, setForceClose] = useState(false)

  const inputRect = useBoundingRect()

  const items = useMemo(() => {
    const noExact = allItems.filter(item => getFilterValue(item) !== filter)
    return fuzzyFilter({
      filter,
      items: noExact,
      getFilterValue,
    }).slice(0, 5)
  }, [filter, getFilterValue, allItems])

  const moveSelection = (diff: number) =>
    setSelection(prev => (items.length + 1 + prev + diff) % (items.length + 1))

  const acceptSelection = () => {
    const selected = items[selection - 1]
    if (!selected) return
    onSelect(selected)
  }

  const keyHandler = (event: KeyboardEvent) => {
    const events: Record<string, () => void> = {
      ArrowDown: () => moveSelection(1),
      ArrowUp: () => moveSelection(-1),
      Enter: () => acceptSelection(),
      Escape: () => setForceClose(true),
    }

    const handler = events[event.key]
    if (!handler) return
    event.preventDefault()
    handler()
  }

  const open = focus && !forceClose && !!filter && items.length > 0

  return (
    <>
      <Slot
        className="relative"
        ref={element => {
          inputRef.current = element
          inputRect.update(element)
        }}
        onKeyDown={keyHandler}
        onChange={() => {
          setSelection(0)
          setForceClose(false)
        }}
      >
        {children}
      </Slot>

      {open && (
        <AutoCompleteDropdown ref={dropdownRef} anchorRect={inputRect.value}>
          {items.map((item, index) => (
            <Button
              key={getFilterValue(item)}
              size="sm"
              onClick={() => onSelect(item)}
              className={cn(
                "w-full justify-between gap-2 truncate text-start",
                index === selection - 1 && "bgl-layer-w/10"
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
