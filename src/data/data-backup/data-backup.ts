import { createAtom, indexedDb } from "lib/yaasl"
import { dateHelpers } from "utils/date-helpers"

interface DataBackupPreferences {
  last: string
  reminderSchedule: number
}

const defaultValue: DataBackupPreferences = {
  last: dateHelpers.today(),
  reminderSchedule: 30,
}

export const dataBackupData = createAtom({
  name: "data-backup",
  defaultValue,
  effects: [indexedDb()],
})
