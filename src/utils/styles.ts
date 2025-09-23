import { VariantProps, cva } from "class-variance-authority"
import {
  BadgeAlert,
  BadgeCheck,
  BadgeInfo,
  BadgeX,
  LucideIcon,
} from "lucide-react"

import { AlertKind } from "types/base-props"

import { cn } from "./cn"

interface AlertStyle {
  icon: LucideIcon
  border: string
  borderGentle: string
  bg: string
}

export const alertStyles: Record<AlertKind, AlertStyle> = {
  info: {
    icon: BadgeInfo,
    bg: "bg-alert-info",
    border: "border-alert-info",
    borderGentle: "border-alert-info/25",
  },
  success: {
    icon: BadgeCheck,
    bg: "bg-alert-success",
    border: "border-alert-success",
    borderGentle: "border-alert-success/25",
  },
  warn: {
    icon: BadgeAlert,
    bg: "bg-alert-warn",
    border: "border-alert-warn",
    borderGentle: "border-alert-warn/25",
  },
  error: {
    icon: BadgeX,
    bg: "bg-alert-error",
    border: "border-alert-error",
    borderGentle: "border-alert-error/25",
  },
}

export const focusWithinOutline = cn(
  "focus-visible:outline-solid [&:has(*:focus-visible)]:outline-solid"
)

export const interactive = cva("cursor-pointer", {
  variants: {
    look: {
      key: "bgl-base-background-button text-text-button hover:bgl-layer-b/15 active:bgl-layer-b/20",
      ghost:
        "text-text bgl-base-transparent border-stroke-button hover:bgl-layer-w/10 active:bgl-layer-w/15 border",
      flat: "text-text bgl-base-transparent hover:bgl-layer-w/10 active:bgl-layer-w/15",
      link: "text-text-priority underline-offset-4 hover:underline active:opacity-80",
      destructive:
        "bg-alert-error/5 border-alert-error text-alert-error hover:bg-alert-error/15 active:bg-alert-error/20 border",
    },
    active: {
      false: "",
    },
    disabled: {
      true: "pointer-events-none opacity-50",
    },
  },
  compoundVariants: [
    {
      active: true,
      disabled: false,
      look: ["ghost", "flat", "link"],
      className: "text-highlight border-highlight",
    },
  ],
  defaultVariants: {
    look: "flat",
    active: false,
    disabled: false,
  },
})
export type InteractiveProps = Omit<
  VariantProps<typeof interactive>,
  "disabled"
>

const stack = cva("", {
  variants: {
    inline: {
      true: "inline-flex",
      false: "flex",
    },
    wrap: {
      true: "flex-wrap",
      false: "flex-nowrap",
    },
    direction: {
      row: "flex-row",
      column: "flex-col",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
      stretch: "justify-stretch",
    },
    gap: {
      0: "gap-0",
      1: "gap-1",
      2: "gap-2",
      4: "gap-4",
      8: "gap-8",
    },
  },
  defaultVariants: {
    inline: false,
  },
})

type StackProps = Omit<VariantProps<typeof stack>, "direction">

export const vstack = (props?: StackProps) =>
  stack({ direction: "column", ...props })

export const hstack = (props?: StackProps) =>
  stack({ direction: "row", ...props })

export const surface = cva("border", {
  variants: {
    look: {
      card: "bg-background border-stroke-gentle shade-low rounded-lg",
      overlay:
        "text-text border-text-gentle/25 bgl-base-b/75 shade-low backdrop-blur-md",
    },
    size: {
      md: "rounded-md p-2",
      lg: "rounded-lg p-4",
    },
  },
})

export const colored = cva("", {
  variants: {
    type: {
      bg: true,
      text: true,
    },
    color: {
      neutral: true,
      //red: true,
      pink: true,
      rose: true,
      orange: true,
      yellow: true,
      lime: true,
      green: true,
      teal: true,
      cyan: true,
      blue: true,
      indigo: true,
      violet: true,
      fuchsia: true,
    },
  },

  compoundVariants: [
    { color: "neutral", type: "text", className: "text-text-priority" },
    //{ color: "red", type: "text", className: "text-category-red" },
    { color: "pink", type: "text", className: "text-category-pink" },
    { color: "rose", type: "text", className: "text-category-rose" },
    { color: "orange", type: "text", className: "text-category-orange" },
    { color: "yellow", type: "text", className: "text-category-yellow" },
    { color: "lime", type: "text", className: "text-category-lime" },
    { color: "green", type: "text", className: "text-category-green" },
    { color: "teal", type: "text", className: "text-category-teal" },
    { color: "cyan", type: "text", className: "text-category-cyan" },
    { color: "blue", type: "text", className: "text-category-blue" },
    { color: "indigo", type: "text", className: "text-category-indigo" },
    { color: "violet", type: "text", className: "text-category-violet" },
    { color: "fuchsia", type: "text", className: "text-category-fuchsia" },

    { color: "neutral", type: "bg", className: "bg-text-priority" },
    //{ color: "red", type: "bg", className: "bg-category-red" },
    { color: "pink", type: "bg", className: "bg-category-pink" },
    { color: "rose", type: "bg", className: "bg-category-rose" },
    { color: "orange", type: "bg", className: "bg-category-orange" },
    { color: "yellow", type: "bg", className: "bg-category-yellow" },
    { color: "lime", type: "bg", className: "bg-category-lime" },
    { color: "green", type: "bg", className: "bg-category-green" },
    { color: "teal", type: "bg", className: "bg-category-teal" },
    { color: "cyan", type: "bg", className: "bg-category-cyan" },
    { color: "blue", type: "bg", className: "bg-category-blue" },
    { color: "indigo", type: "bg", className: "bg-category-indigo" },
    { color: "violet", type: "bg", className: "bg-category-violet" },
    { color: "fuchsia", type: "bg", className: "bg-category-fuchsia" },
  ],
})
export type ThemeColor = NonNullable<VariantProps<typeof colored>["color"]>
export const allColors = [
  //"red",
  "pink",
  "rose",
  "orange",
  "yellow",
  "lime",
  "green",
  "teal",
  "cyan",
  "blue",
  "indigo",
  "violet",
  "fuchsia",
  "neutral",
] satisfies ThemeColor[]
export const getThemeColorPath = (color: ThemeColor) =>
  color === "neutral"
    ? ("color.text.priority" as const)
    : (`color.category.${color}` as const)
