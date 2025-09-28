import { KeyboardEvent } from "react"

import { focusElement } from "utils/focus-element"
import { focusInto, hasFocusableChild } from "utils/focus-into"

const getButtons = (grid: Element) => {
  const buttons = [...grid.children]
  const rowsByPosition = buttons.reduce<Record<number, Element[]>>(
    (rows, button) => {
      const { y } = button.getBoundingClientRect()
      if (!rows[y]) rows[y] = []
      rows[y].push(button)
      return rows
    },
    {}
  )

  return Object.entries(rowsByPosition)
    .sort(([yA], [yB]) => Number(yA) - Number(yB))
    .map(([, buttons]) => buttons)
}

const shiftGridFocus = (event: KeyboardEvent, x: number, y: number) => {
  const grid = event.currentTarget as Element
  const rows = getButtons(grid)

  const currentButton = event.target as Element
  let currentRowIndex = 0
  let currentCellIndex = 0

  rows.some((row, rowIndex) => {
    if (!row.includes(currentButton)) return false
    currentRowIndex = rowIndex
    currentCellIndex = row.indexOf(currentButton)
    return true
  })

  const next = rows[currentRowIndex + y]?.[currentCellIndex + x]

  //const cells = getFocusableElements(grid)
  //const maxIndex = cells.length - 1
  //const nextIndex = clamp(currentIndex + x, 0, maxIndex)
  //const next = cells[nextIndex]

  if (!next) return
  if (hasFocusableChild(next)) focusInto(next)
  else focusElement(next)
}

const eventByKey: Record<string, (event: KeyboardEvent) => void> = {
  ArrowUp: event => shiftGridFocus(event, 0, -1),
  ArrowDown: event => shiftGridFocus(event, 0, 1),
  ArrowLeft: event => shiftGridFocus(event, -1, 0),
  ArrowRight: event => shiftGridFocus(event, 1, 0),
  Home: event => shiftGridFocus(event, 0, -Infinity),
  End: event => shiftGridFocus(event, 0, Infinity),
}

export const focusManager = (event: KeyboardEvent) => {
  if (!Object.keys(eventByKey).includes(event.key)) {
    return
  }
  event.skipGridNavigation = true
  event.preventDefault()
  eventByKey[event.key]?.(event)
}
