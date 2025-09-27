import { createSlice, sessionStorage } from "lib/yaasl"

interface Preferences {
  locale: string
}

const defaultValue: Preferences = {
  locale: "iso",
}

export const preferencesData = createSlice({
  name: "preferences",
  defaultValue,
  effects: [sessionStorage()],
  reducers: {
    setLocale: (state, locale: string) => ({ ...state, locale }),
  },
})
