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
import { getDateAtom, timeEntrySchema, trackedDates } from "./time-entries"

const allDataSchema = z.object({
  preferences: z.optional(preferencesSchema),
  theme: z.optional(themeSchema),
  projects: z.optional(z.array(projectSchema)),
  projectCategories: z.optional(z.record(z.string(), projectCategorySchema)),
  timeEntries: z.optional(z.record(z.string(), z.array(timeEntrySchema))),
})

export type AllData = Resolve<z.infer<typeof allDataSchema>>

const getAllData = (): AllData => {
  const preferences = preferencesData.get()
  const theme = themeData.get()
  const projects = projectsData.get()
  const categories = projectCategories.get()
  const timeEntries = Object.fromEntries(
    trackedDates.get().map(date => [date, getDateAtom(date).get()])
  )

  return {
    preferences,
    theme,
    projects,
    projectCategories: categories,
    timeEntries,
  }
}

const patchAllData = async (data: AllData) => {
  if (data.preferences) preferencesData.set(data.preferences)
  if (data.theme) themeData.set(data.theme)
  if (data.projects) projectsData.set(data.projects)
  if (data.projectCategories) projectCategories.set(data.projectCategories)
  if (data.timeEntries) {
    for (const date of trackedDates.get()) {
      const atom = getDateAtom(date)
      await atom.didInit
      atom.set(atom.defaultValue)
    }
    for (const [date, entries] of Object.entries(data.timeEntries)) {
      const atom = getDateAtom(date)
      await atom.didInit
      atom.set(entries)
    }
  }
}

const resetAllData = async () => {
  preferencesData.set(preferencesData.defaultValue)
  themeData.set(themeData.defaultValue)
  projectsData.set(projectsData.defaultValue)
  projectCategories.set(projectCategories.defaultValue)

  for (const date of trackedDates.get()) {
    const atom = getDateAtom(date)
    await atom.didInit
    atom.set(atom.defaultValue)
  }
}

export const allData = {
  get: getAllData,
  patch: patchAllData,
  reset: resetAllData,
  validate: (data: unknown) => allDataSchema.parse(data),
}
