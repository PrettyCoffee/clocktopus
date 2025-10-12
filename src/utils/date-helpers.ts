export interface ParsedDate {
  year: number
  month: number
  day: number
}

const parse = (date: Date | string) => {
  const dateObj = new Date(date)
  return {
    year: dateObj.getFullYear(),
    month: dateObj.getMonth() + 1,
    day: dateObj.getDate(),
  }
}

const stringify = (date: Date | ParsedDate) => {
  const parsed = date instanceof Date ? parse(date) : date

  return [
    parsed.year.toString().padStart(4, "0"),
    parsed.month.toString().padStart(2, "0"),
    parsed.day.toString().padStart(2, "0"),
  ].join("-")
}

const today = () => stringify(new Date())

export const dateHelpers = {
  today,
  parse,
  stringify,
}
