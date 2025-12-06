import { TimeEntry } from "data/time-entries"
import { createId } from "utils/create-id"

import { CategoryMapping } from "../fragments/select-categories"
import { ColumnLookup } from "../fragments/select-columns"

const twoDigits = (number: number) => String(number).padStart(2, "0")

const toDate = (value: string | undefined) => {
  if (!value) return undefined
  const number = Number(value)
  const date = Number.isNaN(number) ? new Date(value) : new Date(number)
  if (Number.isNaN(date.valueOf())) return undefined

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return `${year}-${twoDigits(month)}-${twoDigits(day)}`
}

const toTime = (value: string | undefined) => {
  if (!value) return undefined
  const [match] = /(\d{2}:\d{2})/.exec(value) ?? []
  if (match) return match

  const date = new Date(value)
  if (!Number.isNaN(date.valueOf())) {
    const hours = date.getHours()
    const minutes = date.getMinutes()
    return `${twoDigits(hours)}:${twoDigits(minutes)}`
  }

  return undefined
}

export const buildRows = (
  rows: string[][],
  columnLookup: ColumnLookup,
  categoryMapping: CategoryMapping
) => {
  // eslint-disable-next-line complexity
  const create = (row: string[]): TimeEntry => {
    const raw = {
      date: row[columnLookup.date ?? -1],
      description: row[columnLookup.description ?? -1],
      category: row[columnLookup.category ?? -1],
      timeStart: row[columnLookup.timeStart ?? -1],
      timeEnd: row[columnLookup.timeEnd ?? -1],
    }

    return {
      id: createId("mini"),
      date: toDate(raw.date) ?? "",
      description: raw.description ?? "",
      categoryId: categoryMapping[raw.category ?? ""],
      start: toTime(raw.timeStart) ?? "",
      end: toTime(raw.timeEnd) ?? "",
    }
  }

  return rows.map(create)
}
