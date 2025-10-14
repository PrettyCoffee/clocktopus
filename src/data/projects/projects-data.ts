import { z } from "zod/mini"

import { createSlice, indexedDb, sync } from "lib/yaasl"
import { Resolve } from "types/util-types"
import { createId } from "utils/create-id"

export const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  categoryId: z.optional(z.string()),
})
export type Project = Resolve<z.infer<typeof projectSchema>>

const defaultValue: Project[] = [
  { id: createId("mini"), name: "Strategic", categoryId: "1" },
  { id: createId("mini"), name: "Maintenance", categoryId: "1" },
  { id: createId("mini"), name: "PR Review", categoryId: "1" },
  { id: createId("mini"), name: "Meeting", categoryId: "2" },
  { id: createId("mini"), name: "Meeting", categoryId: "3" },
  { id: createId("mini"), name: "Course", categoryId: "3" },
  { id: createId("mini"), name: "Other", categoryId: "3" },
  { id: createId("mini"), name: "Break", categoryId: "4" },
]

export const projectsData = createSlice({
  name: "projects",
  defaultValue,
  effects: [indexedDb(), sync()],
  reducers: {
    add: (state, project: Omit<Project, "id">) => [
      ...state,
      { ...project, id: createId("mini") },
    ],
    edit: (state, id: string, project: Partial<Project>) =>
      state.map(item => (item.id !== id ? item : { ...item, ...project })),
    delete: (state, id: string) => state.filter(item => item.id !== id),
  },
})
