import { RefObject, useEffect, useEffectEvent } from "react"

type OnlyStrings<T> = T extends string ? T : never

type ElementType = HTMLElement | Window | Document | null
type EventMap<Type extends ElementType> = Type extends HTMLElement
  ? HTMLElementEventMap
  : Type extends Window
    ? WindowEventMap
    : DocumentEventMap

interface UseEventListenerProps<
  Type extends ElementType,
  EventName extends keyof EventMap<Type>,
> {
  ref: RefObject<Type>
  event: EventName
  onEmit: (e: EventMap<Type>[EventName]) => void
  disabled?: boolean
}

export const useEventListener = <
  Type extends ElementType,
  EventName extends OnlyStrings<keyof EventMap<Type>>,
>({
  ref,
  event,
  onEmit,
  disabled,
}: UseEventListenerProps<Type, EventName>) => {
  const handler = useEffectEvent(onEmit)

  useEffect(() => {
    const element = ref.current
    if (disabled || !element) return

    const emit = (e: EventMap<Type>[EventName]) => handler(e)

    element.addEventListener(event, emit as EventListenerOrEventListenerObject)
    return () => {
      element.removeEventListener(
        event,
        emit as EventListenerOrEventListenerObject
      )
    }
  }, [disabled, event, ref])
}
