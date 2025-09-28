import { KeyboardEvent } from "react"

import { clamp } from "utils/clamp"
import { focusElement } from "utils/focus-element"
import {
  focusInto,
  getFocusableElements,
  hasFocusableChild,
} from "utils/focus-into"

const buttonFilter = (element: Element) => element instanceof HTMLButtonElement

const getNodeIndex = (
  element: Element,
  filter: (element: Element) => boolean
) => [...element.parentNode!.children].filter(filter).indexOf(element)

const shiftGridFocus = (event: KeyboardEvent, x: number) => {
  const grid = event.currentTarget as Element
  const currentButton = event.target as Element
  const currentIndex = getNodeIndex(currentButton, buttonFilter)

  const cells = getFocusableElements(grid)
  const maxIndex = cells.length - 1
  const nextIndex = clamp(currentIndex + x, 0, maxIndex)
  const next = cells[nextIndex]

  if (!next) return
  if (hasFocusableChild(next)) focusInto(next)
  else focusElement(next)
}

const eventByKey: Record<string, (event: KeyboardEvent) => void> = {
  ArrowUp: event => shiftGridFocus(event, -7),
  ArrowDown: event => shiftGridFocus(event, 7),
  ArrowLeft: event => shiftGridFocus(event, -1),
  ArrowRight: event => shiftGridFocus(event, 1),
  Home: event => shiftGridFocus(event, -Infinity),
  End: event => shiftGridFocus(event, Infinity),
}

export const focusManager = (event: KeyboardEvent) => {
  if (!Object.keys(eventByKey).includes(event.key)) {
    return
  }
  eventByKey[event.key]?.(event)
}
