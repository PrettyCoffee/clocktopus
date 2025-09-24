import { createSlice, indexedDb, sync } from "lib/yaasl"
import { createId } from "utils/create-id"
import { ThemeColor } from "utils/styles"

export interface ProjectCategory {
  id: string
  name: string
  color: ThemeColor
}

const defaultValue: Record<string, ProjectCategory> = {
  1: { id: "1", name: "Dev", color: "rose" },
  2: { id: "2", name: "Scrum", color: "blue" },
  3: { id: "3", name: "Misc", color: "amber" },
  4: { id: "4", name: "Break", color: "green" },
}

export const projectCategories = createSlice({
  name: "project-categories",
  defaultValue,
  effects: [indexedDb(), sync()],
  reducers: {
    add: (state, category: Omit<ProjectCategory, "id">) => {
      const id = createId("mini")
      return { ...state, [id]: { ...category, id } }
    },
    edit: (state, id: string, category: Partial<ProjectCategory>) => {
      const existing = state[id]
      if (!existing) return state
      return {
        ...state,
        [id]: { ...existing, ...category, id },
      }
    },
    delete: (state, id: string) => {
      const newState = { ...state }
      delete newState[id]
      return newState
    },
  },
})
