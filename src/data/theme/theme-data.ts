import { z } from "zod"

import { createSlice, sessionStorage } from "lib/yaasl"
import { Resolve } from "types/util-types"
import { getCssVarValue } from "utils/get-css-var-value"
import { allColors, getThemeColorPath } from "utils/styles"

import { theme } from "../../../tailwind/theme"

export const themeSchema = z.object({
  radius: z.number(),
  mode: z.enum(["dark", "light"]),
  colored: z.boolean(),
  accent: z.enum(allColors),
})

type ThemePreferences = Resolve<z.infer<typeof themeSchema>>

const defaultValue: ThemePreferences = {
  radius: theme.defaultTokens.radius,
  mode: "dark",
  colored: false,
  accent: "rose",
}

export const themeData = createSlice({
  name: "user-theme",
  defaultValue,
  effects: [sessionStorage()],

  reducers: {
    setAccent: (state, accent: ThemePreferences["accent"]) => ({
      ...state,
      accent,
    }),
    setMode: (state, mode: ThemePreferences["mode"]) => ({ ...state, mode }),
    toggleColored: state => ({ ...state, colored: !state.colored }),
    setRadius: (state, radius: ThemePreferences["radius"]) => ({
      ...state,
      radius,
    }),
  },
  selectors: {
    getAccent: state => state.accent,
    getMode: state => state.mode,
    getRadius: state => state.radius,
    getColored: state => state.colored,
  },
})

const updateTheme = () => {
  const { mode, colored, radius, accent } = themeData.get()
  const isDark = mode === "dark"
  const root = document.documentElement

  root.classList.toggle("dark", isDark)
  root.classList.toggle("dark-with-accent", isDark && colored)
  root.classList.toggle("light-with-accent", !isDark && colored)
  root.style.setProperty(...theme.write("radius", radius))

  const accentValue = getCssVarValue(theme.getCssVar(getThemeColorPath(accent)))
  root.style.setProperty(...theme.write("color.accent", accentValue))

  const accentHue = Number(accentValue.split(" ")[2])
  root.style.setProperty(...theme.write("color.accentHue", accentHue))
}

export const initTheme = () => {
  updateTheme()
  themeData.subscribe(updateTheme)
}
