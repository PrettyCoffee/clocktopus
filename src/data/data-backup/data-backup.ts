import { createAtom, indexedDb } from "lib/yaasl"
import { dateHelpers } from "utils/date-helpers"

interface DataBackupPreferences {
  last: string
  reminderSchedule: number
  autoDownload: boolean
}

const defaultValue: DataBackupPreferences = {
  last: dateHelpers.today(),
  reminderSchedule: 30,
  autoDownload: false,
}

export const dataBackupData = createAtom({
  name: "data-backup",
  defaultValue,
  effects: [indexedDb()],
})
