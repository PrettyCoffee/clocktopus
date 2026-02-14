import { createSlice } from "lib/yaasl"

const dayInMs = 1000 * 60 * 60 * 24

const getWeekDay = (date: Date) => (date.getDay() + 6) % 7 // Adjust to 0 === monday instead of 0 === sunday

const getDayOfYear = (date: Date) => {
  const yearBefore = new Date(date.getFullYear(), 0, 1)
  yearBefore.setHours(-1)
  const msSinceYear = date.valueOf() - yearBefore.valueOf()
  return Math.floor(msSinceYear / dayInMs) + 1
}

const getCwDateOffset = (year: number) => {
  const firstDay = getWeekDay(new Date(year, 0, 1))
  const offset = firstDay < 4 ? -firstDay : 7 - firstDay
  return offset
}

const getCwStartOfYear = (year: number) => {
  const date = new Date(year, 0, 1)
  const offset = getCwDateOffset(year)
  date.setDate(1 + offset)
  return date
}

const roundUp = (value: number) =>
  Math.floor(value) < value ? Math.floor(value) + 1 : value

const getWeekNumber = (date: Date): { week: number; yearChange: number } => {
  const day = getDayOfYear(date)
  const offset = getCwDateOffset(date.getFullYear())

  const isPreviousYear = day <= offset
  if (isPreviousYear) {
    const newDate = new Date(date)
    newDate.setDate(0)
    return { ...getWeekNumber(newDate), yearChange: -1 }
  }

  const startNextYear = getCwStartOfYear(date.getFullYear() + 1)
  const isNextYear = date.valueOf() >= startNextYear.valueOf()
  if (isNextYear) {
    return { week: 1, yearChange: 1 }
  }

  const isFirstWeek = day < 7 + offset
  if (isFirstWeek) {
    return { week: 1, yearChange: 0 }
  }

  const week = roundUp((day - offset) / 7)
  return { week, yearChange: 0 }
}

const getRelative = (date: Date, days: number) => {
  const newDate = new Date(date)
  newDate.setDate(newDate.getDate() + days)
  return newDate
}

const getWeekDays = (date: Date) => {
  const offsetToMonday = getWeekDay(date)
  const monday = getRelative(date, -offsetToMonday)

  return [
    monday,
    getRelative(monday, 1),
    getRelative(monday, 2),
    getRelative(monday, 3),
    getRelative(monday, 4),
    getRelative(monday, 5),
    getRelative(monday, 6),
  ]
}

const today = new Date()

interface SelectedWeekState {
  year: number
  calendarWeek: number
  days: Date[]
}

export const getWeek = (date: Date): SelectedWeekState => {
  const { week, yearChange } = getWeekNumber(date)
  return {
    year: date.getFullYear() + yearChange,
    calendarWeek: week,
    days: getWeekDays(date),
  }
}

export const selectedWeek = createSlice({
  name: "selected-week",
  defaultValue: getWeek(today),
  reducers: {
    selectDate: (_state, date: Date | string) => getWeek(new Date(date)),
  },
})
