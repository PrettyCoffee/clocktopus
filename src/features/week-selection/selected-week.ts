import { createSlice } from "lib/yaasl"

const getFirstMondayOfYear = (year: number) => {
  const firstDay = new Date(year, 0, 1).getDay()
  return new Date(year, 0, firstDay === 1 ? firstDay : 9 - firstDay)
}

const dayInMs = 1000 * 60 * 60 * 24

const getDayOfYear = (date: Date) => {
  const yearBefore = new Date(date.getFullYear(), 0, 1)
  yearBefore.setHours(-1)
  const msSinceYear = date.valueOf() - yearBefore.valueOf()
  return Math.floor(msSinceYear / dayInMs) + 1
}

function getWeekNumber(date: Date) {
  const secondWeekStart = getFirstMondayOfYear(date.getFullYear()).getDate()
  const dayOfYear = getDayOfYear(date)
  return Math.floor((dayOfYear - secondWeekStart) / 7) + 2
}

const getWeekDays = (date: Date) => {
  const week = getWeekNumber(date)
  const secondWeekStart = getFirstMondayOfYear(date.getFullYear()).getDate()
  const monday = new Date(
    date.getFullYear(),
    0,
    (week - 2) * 7 + secondWeekStart
  )
  const year = monday.getFullYear()
  const month = monday.getMonth()
  return [
    monday,
    new Date(year, month, monday.getDate() + 1),
    new Date(year, month, monday.getDate() + 2),
    new Date(year, month, monday.getDate() + 3),
    new Date(year, month, monday.getDate() + 4),
    new Date(year, month, monday.getDate() + 5),
    new Date(year, month, monday.getDate() + 6),
  ]
}

const today = new Date()

interface SelectedWeekState {
  year: number
  week: number
  days: Date[]
}

const getWeek = (date: Date): SelectedWeekState => ({
  year: date.getFullYear(),
  week: getWeekNumber(date),
  days: getWeekDays(date),
})

export const selectedWeek = createSlice({
  name: "selected-week",
  defaultValue: getWeek(today),
  reducers: {
    selectDate: (_state, date: Date | string) => getWeek(new Date(date)),
  },
})
