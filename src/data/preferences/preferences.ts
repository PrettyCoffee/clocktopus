import { z } from "zod"

import { createSlice, sessionStorage } from "lib/yaasl"
import { Resolve } from "types/util-types"

export const preferencesSchema = z.object({
  locale: z.string(),
})
export type Preferences = Resolve<z.infer<typeof preferencesSchema>>

const defaultValue: Preferences = {
  locale: "iso",
}

export const preferencesData = createSlice({
  name: "preferences",
  defaultValue,
  effects: [sessionStorage()],
  reducers: {
    setLocale: (state, locale: string) => ({
      ...state,
      locale: locale || "iso",
    }),
  },
})
