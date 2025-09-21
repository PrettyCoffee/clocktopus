import { Day } from "./day"

const getMonthStart = (year: number, month: number) => {
  const start = new Day(year, month, 1).getWeekStart()
  if (start.parsed.month !== month) start.meta.isFiller = true
  return start
}

const getMonthDays = (year: number, month: number) => {
  const days: Day[] = [getMonthStart(year, month)]
  let prev = days[0]!
  let next = days[0]!

  /* Alternative to days.length < 42
  const endIsReached = () => {
    const newDay = next.getRelative(1)
    const isNextMonth = newDay.parsed.month > month
    const isNewWeek = newDay.weekday === "Monday"
    return isNextMonth && isNewWeek
  }
  */

  while (days.length < 42) {
    prev = next
    next = prev.getRelative(1)
    if (next.parsed.month !== month) next.meta.isFiller = true
    days.push(next)
  }

  return days
}

export class Month {
  public readonly days: Day[]
  public readonly name: string
  public readonly nameShort: string

  public readonly firstDay: Day
  public readonly lastDay: Day

  constructor(
    public readonly year: number,
    public readonly month: number
  ) {
    this.days = getMonthDays(year, month)

    this.firstDay = new Day(year, month, 1)
    this.lastDay = new Day(year, month + 1, 0)

    this.name = this.firstDay.date.toLocaleDateString("en", { month: "long" })
    this.nameShort = this.firstDay.date.toLocaleDateString("en", {
      month: "short",
    })
  }

  public getRelative(offset: number) {
    let year = this.year
    let month = this.month + offset
    while (month < 1) {
      year--
      month += 12
    }
    while (month > 12) {
      year++
      month -= 12
    }
    return new Month(year, month)
  }
}
