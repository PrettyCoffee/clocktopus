import { z } from "zod/mini"

import { createSlice, indexedDb } from "lib/yaasl"
import { Resolve } from "types/util-types"

export const preferencesSchema = z.object({
  locale: z.string(),
  summaryStyle: z.enum(["table", "grid"]),
})
type Preferences = Resolve<z.infer<typeof preferencesSchema>>

const defaultValue: Preferences = {
  locale: "iso",
  summaryStyle: "table",
}

export const preferencesData = createSlice({
  name: "preferences",
  defaultValue,
  effects: [indexedDb()],
  reducers: {
    setLocale: (state, locale: string) => ({
      ...state,
      locale: locale || "iso",
    }),
    setSummaryStye: (state, summaryStyle: Preferences["summaryStyle"]) => ({
      ...state,
      summaryStyle,
    }),
  },
})
