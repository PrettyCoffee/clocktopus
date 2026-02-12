import { Dispatch, RefObject, useEffect, useEffectEvent, useState } from "react"

interface DropdownNavigationProps<TItem> {
  triggerRef: RefObject<HTMLElement | null>
  items: TItem[]
  onSelect: Dispatch<TItem>
}

export const useDropdownNavigation = <TItem>({
  triggerRef,
  items,
  onSelect,
}: DropdownNavigationProps<TItem>) => {
  const [selection, setSelection] = useState(0)
  const [forceClose, setForceClose] = useState(false)

  useEffect(() => {
    setSelection(0)
  }, [items.length])

  const moveSelection = useEffectEvent((diff: number) => {
    setSelection(prev => (items.length + 1 + prev + diff) % (items.length + 1))
  })
  const acceptSelection = useEffectEvent(() => {
    const selected = items[selection - 1]
    if (!selected) return
    onSelect(selected)
    setSelection(0)
  })
  const closeDropdown = useEffectEvent(() => {
    setForceClose(true)
    setSelection(0)
  })

  const keyHandler = useEffectEvent((event: KeyboardEvent) => {
    const events: Record<string, () => void> = {
      ArrowDown: () => moveSelection(1),
      ArrowUp: () => moveSelection(-1),
      Enter: () => acceptSelection(),
      Escape: () => closeDropdown(),
    }

    if (event.key !== "Escape") {
      setForceClose(false)
    }

    const handler = events[event.key]
    if (!handler) return
    event.preventDefault()
    handler()
  })

  useEffect(() => {
    const trigger = triggerRef.current
    if (!trigger) return

    trigger.addEventListener("keydown", keyHandler)
    return () => {
      trigger.removeEventListener("keydown", keyHandler)
    }
  }, [triggerRef])

  return {
    selectedIndex: selection - 1,
    forceClose: forceClose || items.length === 0,
  }
}
