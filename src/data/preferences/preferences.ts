import { z } from "zod/mini"

import { createSlice, indexedDb, sync } from "lib/yaasl"
import { Resolve } from "types/util-types"

export const preferencesSchema = z.object({
  locale: z.string(),
  language: z.string(),
  summaryStyle: z.enum(["table", "grid"]),
  selectMenuAlignment: z.enum(["item-aligned", "popper"]),
})
type Preferences = Resolve<z.infer<typeof preferencesSchema>>

const defaultValue: Preferences = {
  locale: "iso",
  language: "en",
  summaryStyle: "table",
  selectMenuAlignment: "item-aligned",
}

export const preferencesData = createSlice({
  name: "preferences",
  defaultValue,
  effects: [indexedDb(), sync()],
  reducers: {
    setLocale: (state, locale: string) => ({
      ...state,
      locale: locale || "iso",
    }),
    setLanguage: (state, language: string) => ({
      ...state,
      language: language || "en",
    }),
    setSummaryStye: (state, summaryStyle: Preferences["summaryStyle"]) => ({
      ...state,
      summaryStyle,
    }),
    setSelectMenuAlignment: (
      state,
      selectMenuAlignment: Preferences["selectMenuAlignment"]
    ) => ({
      ...state,
      selectMenuAlignment,
    }),
  },
})
