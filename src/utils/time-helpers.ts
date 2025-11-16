const snap = (value: number, snap: number) => Math.round(value / snap) * snap
const twoDigit = (value: number) =>
  Math.round(value).toString().padStart(2, "0").slice(0, 2)
const getNumbers = (value = "") => value.replaceAll(/[^\d]+/g, "")

export interface ParsedTime {
  hours: number
  minutes: number
}
const parseTime = (value: string): ParsedTime => {
  const numbers = getNumbers(value)
  return {
    hours: Number(numbers.slice(0, 2)),
    minutes: Number(numbers.slice(2, 4)),
  }
}

const deparseTime = (time: ParsedTime) =>
  `${twoDigit(time.hours)}:${twoDigit(time.minutes)}`

const getMinutes = (time: string) => {
  const { hours, minutes } = parseTime(time)
  return hours * 60 + minutes
}

const getTimeDiff = (startTime: string, endTime: string) => {
  const start = getMinutes(startTime)
  const end = getMinutes(endTime)
  return start > end ? end + 24 * 60 - start : end - start
}

const timeFromMinutes = (minutesDiff: number) => {
  const minutes = minutesDiff % 60
  const hours = (minutesDiff - minutes) / 60
  return deparseTime({ hours, minutes })
}

const currentTime = (options: { snap?: number } = {}) => {
  const date = new Date()
  const hours = date.getHours()
  const minutes = snap(date.getMinutes(), options.snap ?? 1)

  if (minutes >= 60) {
    return deparseTime({ hours: hours + 1, minutes: minutes % 60 })
  }
  return deparseTime({ hours, minutes })
}

const addMinutes = (timeString: string, diff: number) => {
  const time = parseTime(timeString)
  const newTime = Math.max(time.hours * 60 + time.minutes + diff, 0)

  const newMinutes = newTime % 60
  const newHours = (newTime - newMinutes) / 60
  return deparseTime({ hours: newHours, minutes: newMinutes })
}

export const timeHelpers = {
  getDiff: getTimeDiff,
  toMinutes: getMinutes,
  fromMinutes: timeFromMinutes,
  toParsed: parseTime,
  fromParsed: deparseTime,
  now: currentTime,
  addMinutes,
}
