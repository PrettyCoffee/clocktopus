import { z } from "zod/mini"

import { createAtom, indexedDb } from "lib/yaasl"
import { Resolve } from "types/util-types"
import { dateHelpers } from "utils/date-helpers"

export const dataBackupSchema = z.object({
  last: z.string(),
  reminderSchedule: z.number(),
})
type Preferences = Resolve<z.infer<typeof dataBackupSchema>>

const defaultValue: Preferences = {
  last: dateHelpers.today(),
  reminderSchedule: 30,
}

export const dataBackupData = createAtom({
  name: "data-backup",
  defaultValue,
  effects: [indexedDb()],
})
