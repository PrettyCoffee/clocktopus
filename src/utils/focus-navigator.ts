import { KeyboardEvent } from "react"

import { clamp } from "./clamp"
import { focusInto } from "./focus-into"

interface Offset {
  x: number
  y: number
}

const getCellRows = (grid: Element, cellSelector: string) => {
  const cells = [...grid.querySelectorAll(cellSelector)]
  const rowsByPosition = cells.reduce<Record<number, Element[]>>(
    (rows, cell) => {
      const { y } = cell.getBoundingClientRect()
      if (!rows[y]) rows[y] = []
      rows[y].push(cell)
      return rows
    },
    {}
  )

  return Object.entries(rowsByPosition)
    .sort(([yA], [yB]) => Number(yA) - Number(yB))
    .map(([, row]) => row)
}

interface FocusNavigatorProps {
  event: KeyboardEvent
  cellSelector: string
  offset: Offset
}

const isDisabled = (element?: Element) => {
  if (!element) return false
  if ("disabled" in element && element.disabled) return true
  if (element.ariaDisabled) return true
  return false
}

const getNextInAxis = (
  rows: Element[][],
  position: Offset,
  direction: Partial<Offset>
) => {
  if (!direction.x && !direction.y) return undefined

  let { x, y } = position
  while (rows[y]?.[x]) {
    const cell = rows[y]?.[x]
    if (cell && !isDisabled(cell)) return cell
    x += direction.x ?? 0
    y += direction.y ?? 0
  }
  return undefined
}

const getNextNonDisabledCell = (
  rows: Element[][],
  position: Offset,
  offset: Offset
) => {
  const getFirst = () => {
    if (offset.x !== -Infinity && offset.y !== -Infinity) return undefined
    return rows.flat().find(cell => !isDisabled(cell))
  }
  const getLast = () => {
    if (offset.x !== Infinity && offset.y !== Infinity) return undefined
    return rows.flat().findLast(cell => !isDisabled(cell))
  }

  return (
    getNextInAxis(rows, position, { x: clamp(offset.x, -1, 1) }) ||
    getNextInAxis(rows, position, { y: clamp(offset.y, -1, 1) }) ||
    getFirst() ||
    getLast()
  )
}

export const focusNavigator = ({
  event,
  cellSelector,
  offset,
}: FocusNavigatorProps) => {
  const grid = event.currentTarget as Element
  const current = event.target as Element
  const rows = getCellRows(grid, cellSelector)

  const position = { x: 0, y: 0 }
  rows.some((row, rowIndex) => {
    if (!row.includes(current)) return false
    position.y = rowIndex
    position.x = row.indexOf(current)
    return true
  })

  const rowIndex = clamp(position.y + offset.y, 0, rows.length - 1)
  const row = rows[rowIndex]
  if (!row) return

  const cellIndex = clamp(position.x + offset.x, 0, row.length - 1)
  let cell = row[cellIndex]
  if (isDisabled(cell)) {
    cell = getNextNonDisabledCell(rows, { x: cellIndex, y: rowIndex }, offset)
  }
  if (!cell) return

  focusInto(cell)
}
