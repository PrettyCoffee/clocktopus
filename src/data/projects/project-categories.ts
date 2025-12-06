import { z } from "zod/mini"

import { autoSort, createSlice, indexedDb, sync } from "lib/yaasl"
import { Resolve } from "types/util-types"
import { createId } from "utils/create-id"
import { allColors } from "utils/styles"

export const projectCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.enum(allColors),
})
export type ProjectCategory = Resolve<z.infer<typeof projectCategorySchema>>

const defaultValue: ProjectCategory[] = [
  { id: "1", name: "Dev", color: "rose" },
  { id: "2", name: "Scrum", color: "blue" },
  { id: "3", name: "Misc", color: "amber" },
  { id: "4", name: "Break", color: "green" },
]

export const projectCategories = createSlice({
  name: "project-categories",
  defaultValue,
  effects: [
    autoSort<ProjectCategory>({
      sortFn: (a, b) => a.name.localeCompare(b.name),
    }),
    indexedDb(),
    sync(),
  ],
  reducers: {
    add: (state, data: Omit<ProjectCategory, "id">) => {
      const id = createId("mini")
      return [...state, { ...data, id }]
    },
    edit: (state, id: string, data: Partial<ProjectCategory>) =>
      state.map(category =>
        category.id !== id ? category : { ...category, ...data, id }
      ),
    delete: (state, id: string) => state.filter(category => category.id !== id),
  },
})
