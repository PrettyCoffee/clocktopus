import { z } from "zod/mini"

import { createSlice, indexedDb, sync } from "lib/yaasl"
import { Resolve } from "types/util-types"
import { arrayMove } from "utils/array-move"
import { createId } from "utils/create-id"

export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  groupId: z.optional(z.string()),
  isPrivate: z.optional(z.boolean()),
})
export type Category = Resolve<z.infer<typeof categorySchema>>

const defaultValue: Category[] = [
  { id: createId("mini"), name: "Strategic", groupId: "1" },
  { id: createId("mini"), name: "Maintenance", groupId: "1" },
  { id: createId("mini"), name: "PR Review", groupId: "1" },
  { id: createId("mini"), name: "Research", groupId: "1" },
  { id: createId("mini"), name: "Meeting", groupId: "2" },
  { id: createId("mini"), name: "Meeting", groupId: "3" },
  { id: createId("mini"), name: "Learning", groupId: "3" },
  { id: createId("mini"), name: "Other", groupId: "3" },
  { id: createId("mini"), name: "Break", isPrivate: true, groupId: "4" },
]

export const categoriesData = createSlice({
  name: "categories",
  defaultValue,
  effects: [indexedDb(), sync()],
  reducers: {
    add: (state, category: Omit<Category, "id">) => [
      ...state,
      { ...category, id: createId("mini") },
    ],
    edit: (state, id: string, category: Partial<Category>) =>
      state.map(item => (item.id !== id ? item : { ...item, ...category })),
    delete: (state, id: string) => state.filter(item => item.id !== id),
    move: (state, id: string, change: number) => {
      const oldIndex = state.findIndex(category => category.id === id)
      return arrayMove(state, oldIndex, oldIndex + change)
    },
  },
})
