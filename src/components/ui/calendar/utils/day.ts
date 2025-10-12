import { dateHelpers, ParsedDate } from "utils/date-helpers"

interface DayMeta {
  isFiller: boolean
  isToday: boolean
}

export class Day {
  public readonly date: Date
  public readonly meta: DayMeta = { isFiller: false, isToday: false }
  public readonly weekday: string
  public readonly weekdayNumber: number
  public readonly parsed: ParsedDate

  constructor(...args: [Date] | [string] | [number, number, number]) {
    if (args.length === 3) {
      // Date class needs 0 based months
      args[1] -= 1
    }
    this.date = Object.freeze(new Date(...(args as [Date])))

    this.parsed = dateHelpers.parse(this.date)

    this.weekday = this.date.toLocaleDateString("en", { weekday: "long" })

    this.weekdayNumber = {
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
      Sunday: 7,
    }[this.weekday]!

    this.meta.isToday = dateHelpers.today() === this.toString()
  }

  public toString() {
    return dateHelpers.stringify(this.parsed)
  }

  public getRelative(dayOffset: number): Day {
    const { year, month, day } = this.parsed
    return new Day(year, month, day + dayOffset)
  }

  public getWeekStart() {
    if (this.weekday === "Monday") return this
    return this.getRelative(-1 * (this.weekdayNumber - 1))
  }
  public getWeekEnd() {
    return this.getRelative(this.weekdayNumber - 1)
  }
}
