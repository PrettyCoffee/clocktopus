import { KeyboardEvent } from "react"

import { clamp } from "utils/clamp"
import { focusElement } from "utils/focus-element"
import { focusInto, hasFocusableChild } from "utils/focus-into"

const getGridCells = (grid: Element) => {
  const rowGroups = [...grid.querySelectorAll("[role='rowgroup']")]
  const rows = rowGroups.flatMap(rowGroup => [
    ...rowGroup.querySelectorAll("[role='row']"),
  ])
  return rows.map(row => [...row.querySelectorAll("[role='gridcell']")])
}

const focusGrid = (grid: Element, x: number, y: number) => {
  const cells = getGridCells(grid)
  const row = cells[clamp(y, 0, cells.length - 1)]
  const cell = row?.[clamp(x, 0, row.length - 1)]

  if (!cell) return

  if (hasFocusableChild(cell)) focusInto(cell)
  else focusElement(cell)
}

interface KeyDownProps {
  event: KeyboardEvent
  name?: string
}

interface ShiftProps {
  x: number
  y: number
}

const shiftGridFocus = (
  { event, name }: KeyDownProps,
  { x, y }: ShiftProps
) => {
  const grid = event.currentTarget as Element
  const rows = getGridCells(grid)

  let currentRow = 0
  let currentCell = 0
  rows.some((row, rowIndex) => {
    const cellIndex = row.findIndex(
      cell => cell === event.target || cell.contains(event.target as Node)
    )
    if (cellIndex === -1) return false
    currentCell = cellIndex
    currentRow = rowIndex
    return true
  })

  const maxRowIndex = rows.length - 1
  const newRowIndex = clamp(currentRow + y, 0, maxRowIndex)

  const switchPrevGrid = currentRow + y < 0 && y !== -Infinity
  const switchNextGrid = currentRow + y > maxRowIndex && y !== Infinity
  if (name && (switchPrevGrid || switchNextGrid)) {
    const grids = [...document.querySelectorAll(`[data-grid-name="${name}"]`)]
    const currentGrid = grids.indexOf(grid)

    if (switchPrevGrid) {
      const newGrid = grids[currentGrid - 1]
      if (newGrid) focusGrid(newGrid, currentCell, Infinity)
    } else {
      const newGrid = grids[currentGrid + 1]
      if (newGrid) focusGrid(newGrid, currentCell, 0)
    }
    return
  }

  const maxCellIndex = rows[newRowIndex]!.length - 1
  const newCellIndex = clamp(currentCell + x, 0, maxCellIndex)
  focusGrid(grid, newCellIndex, newRowIndex)
}

const eventByKey: Record<string, (props: KeyDownProps) => void> = {
  ArrowUp: props => shiftGridFocus(props, { x: 0, y: -1 }),
  ArrowDown: props => shiftGridFocus(props, { x: 0, y: 1 }),
  ArrowLeft: props => shiftGridFocus(props, { x: -1, y: 0 }),
  ArrowRight: props => shiftGridFocus(props, { x: 1, y: 0 }),
  Home: props => shiftGridFocus(props, { x: 0, y: -Infinity }),
  End: props => shiftGridFocus(props, { x: 0, y: Infinity }),
  PageUp: props => shiftGridFocus(props, { x: 0, y: -Infinity }),
  PageDown: props => shiftGridFocus(props, { x: 0, y: Infinity }),
}

const handleKeyDown = (props: KeyDownProps) => {
  if (props.event.skipGridNavigation) return

  const key = props.event.key
  if (!(key in eventByKey)) return
  props.event.preventDefault()
  eventByKey[key]?.(props)
}

export const focusManager = {
  listen: handleKeyDown,
  eventKeys: Object.keys(eventByKey),
}
