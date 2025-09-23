import twColors from "tailwindcss/colors"

import { createTheme } from "./plugins/theme-vars-plugin"
import { parseColor } from "../src/utils/color"

const parseOklch = (value: string) => {
  const color = parseColor(value)
  if (!color || color.mode !== "oklch")
    throw new Error("This is no oklch color: " + value)
  return color
}

const getOklchHue = (value: string) => {
  const { color } = parseOklch(value)
  return color[2]
}

const replaceOklchHue = (baseColor: string, hueColor: string) => {
  const base = parseOklch(baseColor)

  return `${base.color[0]} ${base.color[1]} ${hueColor}`
}

const colors = {
  neutral: {
    "0": "#fff",
    ...twColors.neutral,
    "1000": "#000",
  },
  neutralWithAccent: {
    "0": "#fff",
    ...(Object.fromEntries(
      Object.entries(twColors.stone).map(([key, value]) => [
        key,
        replaceOklchHue(value, "var(--tw-theme-color-accentHue)"),
      ])
    ) as typeof twColors.stone),
    "1000": "#000",
  },
  accent: twColors.rose,
  alert: {
    error: twColors.red,
    warn: twColors.yellow,
    info: twColors.blue,
    success: twColors.green,
  },
  category: {
    pink: twColors.pink,
    rose: twColors.rose,
    //red: twColors.red,
    orange: twColors.orange,
    amber: twColors.amber,
    //yellow: twColors.yellow,
    lime: twColors.lime,
    green: twColors.green,
    emerald: twColors.emerald,
    teal: twColors.teal,
    cyan: twColors.cyan,
    sky: twColors.sky,
    blue: twColors.blue,
    indigo: twColors.indigo,
    violet: twColors.violet,
    purple: twColors.purple,
    fuchsia: twColors.fuchsia,
  },
}

export const theme = createTheme({
  tokens: {
    radius: 12,
    color: {
      black: colors.neutral["0"],
      white: colors.neutral["1000"],
      transparent: "transparent",
      current: "currentColor",
      inherit: "inherit",

      accentHue: getOklchHue(colors.accent["500"]),
      accent: colors.accent["500"],
      shadow: colors.neutral["300"],
      background: {
        page: colors.neutral["100"],
        default: colors.neutral["50"],
        invert: colors.neutral["950"],
        button: colors.neutral["800"],
      },
      text: {
        priority: colors.neutral["950"],
        default: colors.neutral["800"],
        gentle: colors.neutral["600"],
        muted: colors.neutral["500"],
        invert: colors.neutral["50"],
        button: colors.neutral["50"],
      },
      stroke: {
        default: colors.neutral["600"],
        gentle: colors.neutral["200"],
        //muted: colors.neutral["800"],
        invert: colors.neutral["950"],
        button: colors.neutral["800"],
      },
      alert: {
        error: colors.alert.error["500"],
        warn: colors.alert.warn["500"],
        info: colors.alert.info["500"],
        success: colors.alert.success["500"],
      },
      category: {
        pink: colors.category.pink[500],
        rose: colors.category.rose[500],
        //red: colors.category.red[500],
        orange: colors.category.orange[500],
        amber: colors.category.amber[500],
        //yellow: colors.category.yellow[500],
        lime: colors.category.lime[500],
        green: colors.category.green[500],
        emerald: colors.category.emerald[500],
        teal: colors.category.teal[500],
        cyan: colors.category.cyan[500],
        sky: colors.category.sky[500],
        blue: colors.category.blue[500],
        indigo: colors.category.indigo[500],
        violet: colors.category.violet[500],
        purple: colors.category.purple[500],
        fuchsia: colors.category.fuchsia[500],
      },
    },
  },

  twTheme: get => ({
    borderRadius: {
      "2xl": get("radius", "calc(<var> / 8 * 1rem)"), // 1rem
      xl: get("radius", "calc(<var> / 10.666 * 1rem)"), // 0.75rem
      lg: get("radius", "calc(<var> / 16 * 1rem)"), // 0.5rem
      md: get("radius", "calc(<var> / 21.333 * 1rem)"), // 0.375rem
      sm: get("radius", "calc(<var> / 32 * 1rem)"), // 0.25rem
      full: "9999px",
      none: "0px",
    },
    colors: {
      black: get("color.black"),
      white: get("color.white"),
      transparent: "transparent",
      current: "currentColor",
      inherit: "inherit",

      highlight: get("color.accent"),
      shadow: get("color.shadow"),
      background: {
        page: get("color.background.page"),
        DEFAULT: get("color.background.default"),
        invert: get("color.background.invert"),
        button: get("color.background.button"),
      },
      text: {
        priority: get("color.text.priority"),
        DEFAULT: get("color.text.default"),
        gentle: get("color.text.gentle"),
        muted: get("color.text.muted"),
        invert: get("color.text.invert"),
        button: get("color.text.button"),
      },
      stroke: {
        DEFAULT: get("color.stroke.default"),
        gentle: get("color.stroke.gentle"),
        //muted: get("color.neutral.800"),
        invert: get("color.stroke.invert"),
        button: get("color.stroke.button"),
        focus: get("color.accent"),
      },
      alert: {
        error: get("color.alert.error"),
        warn: get("color.alert.warn"),
        info: get("color.alert.info"),
        success: get("color.alert.success"),
      },
      category: {
        pink: get("color.category.pink"),
        rose: get("color.category.rose"),
        //red: get("color.category.red"),
        orange: get("color.category.orange"),
        amber: get("color.category.amber"),
        //yellow: get("color.category.yellow"),
        lime: get("color.category.lime"),
        green: get("color.category.green"),
        emerald: get("color.category.emerald"),
        teal: get("color.category.teal"),
        cyan: get("color.category.cyan"),
        sky: get("color.category.sky"),
        blue: get("color.category.blue"),
        indigo: get("color.category.indigo"),
        violet: get("color.category.violet"),
        purple: get("color.category.purple"),
        fuchsia: get("color.category.fuchsia"),
      },
    },
  }),
})

theme.addVariant("dark", {
  radius: 8,
  color: {
    black: colors.neutral["1000"],
    white: colors.neutral["0"],
    transparent: "transparent",
    current: "currentColor",
    inherit: "inherit",

    accentHue: getOklchHue(colors.accent["300"]),
    accent: colors.accent["300"],
    shadow: colors.neutral["1000"],
    background: {
      page: colors.neutral["950"],
      default: colors.neutral["900"],
      invert: colors.neutral["50"],
      button: colors.neutral["50"],
    },
    text: {
      priority: colors.neutral["50"],
      default: colors.neutral["200"],
      gentle: colors.neutral["400"],
      muted: colors.neutral["500"],
      invert: colors.neutral["950"],
      button: colors.neutral["950"],
    },
    stroke: {
      default: colors.neutral["400"],
      gentle: colors.neutral["800"],
      //muted: colors.neutral["800"],
      invert: colors.neutral["50"],
      button: colors.neutral["50"],
    },
    alert: {
      error: colors.alert.error["400"],
      warn: colors.alert.warn["400"],
      info: colors.alert.info["400"],
      success: colors.alert.success["400"],
    },
    category: {
      pink: colors.category.pink[300],
      rose: colors.category.rose[300],
      //red: colors.category.red[300],
      orange: colors.category.orange[300],
      amber: colors.category.amber[300],
      //yellow: colors.category.yellow[300],
      lime: colors.category.lime[300],
      green: colors.category.green[300],
      emerald: colors.category.emerald[300],
      teal: colors.category.teal[300],
      cyan: colors.category.cyan[300],
      sky: colors.category.sky[300],
      blue: colors.category.blue[300],
      indigo: colors.category.indigo[300],
      violet: colors.category.violet[300],
      purple: colors.category.purple[300],
      fuchsia: colors.category.fuchsia[300],
    },
  },
})

theme.addVariant("light-with-accent", {
  radius: 8,
  color: {
    black: colors.neutralWithAccent["0"],
    white: colors.neutralWithAccent["1000"],
    transparent: "transparent",
    current: "currentColor",
    inherit: "inherit",

    accentHue: getOklchHue(colors.accent["500"]),
    accent: colors.accent["500"],
    shadow: colors.neutralWithAccent["300"],
    background: {
      page: colors.neutralWithAccent["100"],
      default: colors.neutralWithAccent["50"],
      invert: colors.neutralWithAccent["950"],
      button: colors.neutralWithAccent["800"],
    },
    text: {
      priority: colors.neutralWithAccent["950"],
      default: colors.neutralWithAccent["800"],
      gentle: colors.neutralWithAccent["600"],
      muted: colors.neutralWithAccent["500"],
      invert: colors.neutralWithAccent["50"],
      button: colors.neutralWithAccent["50"],
    },
    stroke: {
      default: colors.neutralWithAccent["600"],
      gentle: colors.neutralWithAccent["200"],
      //muted: colors.neutralWithAccent["800"],
      invert: colors.neutralWithAccent["950"],
      button: colors.neutralWithAccent["800"],
    },
    alert: {
      error: colors.alert.error["500"],
      warn: colors.alert.warn["500"],
      info: colors.alert.info["500"],
      success: colors.alert.success["500"],
    },
    category: {
      pink: colors.category.pink[500],
      rose: colors.category.rose[500],
      //red: colors.category.red[500],
      orange: colors.category.orange[500],
      amber: colors.category.amber[500],
      //yellow: colors.category.yellow[500],
      lime: colors.category.lime[500],
      green: colors.category.green[500],
      emerald: colors.category.emerald[500],
      teal: colors.category.teal[500],
      cyan: colors.category.cyan[500],
      sky: colors.category.sky[500],
      blue: colors.category.blue[500],
      indigo: colors.category.indigo[500],
      violet: colors.category.violet[500],
      purple: colors.category.purple[500],
      fuchsia: colors.category.fuchsia[500],
    },
  },
})

theme.addVariant("dark-with-accent", {
  radius: 8,
  color: {
    black: colors.neutralWithAccent["1000"],
    white: colors.neutralWithAccent["0"],
    transparent: "transparent",
    current: "currentColor",
    inherit: "inherit",

    accentHue: getOklchHue(colors.accent["300"]),
    accent: colors.accent["300"],
    shadow: colors.neutralWithAccent["1000"],
    background: {
      page: colors.neutralWithAccent["950"],
      default: colors.neutralWithAccent["900"],
      invert: colors.neutralWithAccent["50"],
      button: colors.neutralWithAccent["50"],
    },
    text: {
      priority: colors.neutralWithAccent["50"],
      default: colors.neutralWithAccent["200"],
      gentle: colors.neutralWithAccent["400"],
      muted: colors.neutralWithAccent["500"],
      invert: colors.neutralWithAccent["950"],
      button: colors.neutralWithAccent["950"],
    },
    stroke: {
      default: colors.neutralWithAccent["400"],
      gentle: colors.neutralWithAccent["800"],
      //muted: colors.neutralWithAccent["800"],
      invert: colors.neutralWithAccent["50"],
      button: colors.neutralWithAccent["50"],
    },
    alert: {
      error: colors.alert.error["300"],
      warn: colors.alert.warn["300"],
      info: colors.alert.info["300"],
      success: colors.alert.success["300"],
    },
    category: {
      pink: colors.category.pink[300],
      rose: colors.category.rose[300],
      //red: colors.category.red[300],
      orange: colors.category.orange[300],
      amber: colors.category.amber[300],
      //yellow: colors.category.yellow[300],
      lime: colors.category.lime[300],
      green: colors.category.green[300],
      emerald: colors.category.emerald[300],
      teal: colors.category.teal[300],
      cyan: colors.category.cyan[300],
      sky: colors.category.sky[300],
      blue: colors.category.blue[300],
      indigo: colors.category.indigo[300],
      violet: colors.category.violet[300],
      purple: colors.category.purple[300],
      fuchsia: colors.category.fuchsia[300],
    },
  },
})
