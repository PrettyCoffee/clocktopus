import { z } from "zod/mini"

import { themeData, themeSchema } from "data/theme"
import { Resolve } from "types/util-types"

import {
  categoryGroupsData,
  categoryGroupSchema,
  categorySchema,
  categoriesData,
} from "./categories"
import { preferencesData, preferencesSchema } from "./preferences"
import { timeEntrySchema, timeEntriesData } from "./time-entries"

const allDataSchema = z.object({
  preferences: z.optional(preferencesSchema),
  theme: z.optional(themeSchema),
  categories: z.optional(z.array(categorySchema)),
  categoryGroups: z.optional(z.array(categoryGroupSchema)),
  timeEntries: z.optional(z.record(z.string(), z.array(timeEntrySchema))),
})

export type AllData = Resolve<z.infer<typeof allDataSchema>>

const getAllData = (): AllData => ({
  preferences: preferencesData.get(),
  theme: themeData.get(),
  categories: categoriesData.get(),
  categoryGroups: categoryGroupsData.get(),
  timeEntries: timeEntriesData.get(),
})

const patchAllData = (data: AllData) => {
  if (data.preferences) preferencesData.set(data.preferences)
  if (data.theme) themeData.set(data.theme)
  if (data.categories) categoriesData.set(data.categories)
  if (data.categoryGroups) categoryGroupsData.set(data.categoryGroups)
  if (data.timeEntries) timeEntriesData.set(data.timeEntries)
}

const resetAllData = () => {
  preferencesData.set(preferencesData.defaultValue)
  themeData.set(themeData.defaultValue)
  categoriesData.set(categoriesData.defaultValue)
  categoryGroupsData.set(categoryGroupsData.defaultValue)
  timeEntriesData.set(timeEntriesData.defaultValue)
}

export const allData = {
  get: getAllData,
  patch: patchAllData,
  reset: resetAllData,
  validate: (data: unknown) => allDataSchema.parse(data),
}
