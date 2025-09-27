import { KeyboardEvent } from "react"

import { clamp } from "utils/clamp"
import { focusElement } from "utils/focus-element"
import { focusInto, hasFocusableChild } from "utils/focus-into"

const cellFilter = ({ role }: Element) => role === "gridcell"
const rowFilter = ({ role }: Element) => role === "row"

const getNodeIndex = (
  element: Element,
  filter: (element: Element) => boolean
) => [...element.parentNode!.children].filter(filter).indexOf(element)

const shiftGridFocus = (current: Element, x: number, y: number) => {
  const row = current.parentNode as Element
  const rowGroup = row.parentNode as Element

  const currentRow = getNodeIndex(row, rowFilter)
  const currentCell = getNodeIndex(current, cellFilter)

  const rows = [...rowGroup.children].filter(rowFilter)
  const maxRowIndex = rows.length - 1
  const rowIndex = clamp(currentRow + y, 0, maxRowIndex)
  const newRow = rows[rowIndex]

  const cells = [...(newRow?.children ?? [])].filter(cellFilter)
  const maxCellIndex = cells.length - 1
  const cellIndex = clamp(currentCell + x, 0, maxCellIndex)
  const newCell = cells[cellIndex]

  if (!newCell) return
  if (hasFocusableChild(newCell)) focusInto(newCell)
  else focusElement(newCell)
}

const eventByKey: Record<string, (target: Element) => void> = {
  ArrowUp: target => shiftGridFocus(target, 0, -1),
  ArrowDown: target => shiftGridFocus(target, 0, 1),
  ArrowLeft: target => shiftGridFocus(target, -1, 0),
  ArrowRight: target => shiftGridFocus(target, 1, 0),
  Home: target => shiftGridFocus(target, 0, -Infinity),
  End: target => shiftGridFocus(target, 0, Infinity),
}

export const gridNavigationFocus = (event: KeyboardEvent) => {
  if (!Object.keys(eventByKey).includes(event.key)) {
    return
  }
  eventByKey[event.key]?.(event.currentTarget as Element)
}
