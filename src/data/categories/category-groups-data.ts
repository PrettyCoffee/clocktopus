import { z } from "zod/mini"

import { createSlice, indexedDb, sync } from "lib/yaasl"
import { Resolve } from "types/util-types"
import { arrayMove } from "utils/array-move"
import { createId } from "utils/create-id"
import { allColors } from "utils/styles"

export const categoryGroupSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.enum(allColors),
})
export type CategoryGroup = Resolve<z.infer<typeof categoryGroupSchema>>

const defaultValue: CategoryGroup[] = [
  { id: "1", name: "Dev", color: "rose" },
  { id: "2", name: "Scrum", color: "blue" },
  { id: "3", name: "Misc", color: "amber" },
  { id: "4", name: "Break", color: "green" },
]

export const categoryGroupsData = createSlice({
  name: "category-groups",
  defaultValue,
  effects: [indexedDb(), sync()],
  reducers: {
    add: (state, data: Omit<CategoryGroup, "id">) => {
      const id = createId("mini")
      return [...state, { ...data, id }]
    },
    edit: (state, id: string, data: Partial<CategoryGroup>) =>
      state.map(group => (group.id !== id ? group : { ...group, ...data, id })),
    delete: (state, id: string) => state.filter(group => group.id !== id),
    move: (state, id: string, change: number) => {
      const oldIndex = state.findIndex(group => group.id === id)
      return arrayMove(state, oldIndex, oldIndex + change)
    },
  },
})
