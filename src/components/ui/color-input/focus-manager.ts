import { KeyboardEvent } from "react"

import { focusNavigator } from "utils/focus-navigator"

const shiftFocus = (event: KeyboardEvent, x: number, y: number) =>
  focusNavigator({ event, cellSelector: "button", offset: { x, y } })

const eventByKey: Record<string, (event: KeyboardEvent) => void> = {
  ArrowUp: event => shiftFocus(event, 0, -1),
  ArrowDown: event => shiftFocus(event, 0, 1),
  ArrowLeft: event => shiftFocus(event, -1, 0),
  ArrowRight: event => shiftFocus(event, 1, 0),
  Home: event => shiftFocus(event, 0, -Infinity),
  End: event => shiftFocus(event, 0, Infinity),
}

export const focusManager = (event: KeyboardEvent) => {
  if (!Object.keys(eventByKey).includes(event.key)) {
    return
  }
  event.skipGridNavigation = true
  event.preventDefault()
  eventByKey[event.key]?.(event)
}
