import { z } from "zod"

import { themeData, themeSchema } from "data/theme"
import { Resolve } from "types/util-types"

import { preferencesData, preferencesSchema } from "./preferences"
import {
  projectCategories,
  projectCategorySchema,
  projectSchema,
  projectsData,
} from "./projects"
import { timeEntrySchema, timeEntriesData } from "./time-entries"

const allDataSchema = z.object({
  preferences: z.optional(preferencesSchema),
  theme: z.optional(themeSchema),
  projects: z.optional(z.array(projectSchema)),
  projectCategories: z.optional(z.record(z.string(), projectCategorySchema)),
  timeEntries: z.optional(z.record(z.string(), z.array(timeEntrySchema))),
})

export type AllData = Resolve<z.infer<typeof allDataSchema>>

const getAllData = (): AllData => ({
  preferences: preferencesData.get(),
  theme: themeData.get(),
  projects: projectsData.get(),
  projectCategories: projectCategories.get(),
  timeEntries: timeEntriesData.get(),
})

const patchAllData = (data: AllData) => {
  if (data.preferences) preferencesData.set(data.preferences)
  if (data.theme) themeData.set(data.theme)
  if (data.projects) projectsData.set(data.projects)
  if (data.projectCategories) projectCategories.set(data.projectCategories)
  if (data.timeEntries) timeEntriesData.set(data.timeEntries)
}

const resetAllData = () => {
  preferencesData.set(preferencesData.defaultValue)
  themeData.set(themeData.defaultValue)
  projectsData.set(projectsData.defaultValue)
  projectCategories.set(projectCategories.defaultValue)
  timeEntriesData.set(timeEntriesData.defaultValue)
}

export const allData = {
  get: getAllData,
  patch: patchAllData,
  reset: resetAllData,
  validate: (data: unknown) => allDataSchema.parse(data),
}
