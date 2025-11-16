import { CSSProperties } from "react"

import { ease } from "utils/ease"

const DURATION = 1000

type AllowedElement = HTMLElement | SVGElement

const toCssProperty = (jsKey: string) =>
  jsKey.replaceAll(/[A-Z]/g, ([match]) => "-" + match?.toLowerCase())

const toCssProperties = (styles: CSSProperties) =>
  Object.keys(styles).map(toCssProperty).join(",")

const applyStyles = (node: AllowedElement, styles: CSSProperties) => {
  Object.entries(styles).forEach(([key, value]) =>
    node.style.setProperty(toCssProperty(key), String(value || ""))
  )
}

interface TransitionProps<TElement extends AllowedElement> {
  initStyles: CSSProperties | ((node: TElement) => CSSProperties)
  targetStyles: CSSProperties | ((node: TElement) => CSSProperties)
  timingFunction?: keyof typeof ease
}

interface InitTransitionProps<TElement extends AllowedElement> {
  items?: number
  index?: number
  node: TElement | null
}

export const createTransition = <TElement extends AllowedElement>({
  initStyles,
  targetStyles,
  timingFunction = "out",
}: TransitionProps<TElement>) => {
  const initTransition = (node: TElement) => {
    const styles =
      initStyles instanceof Function ? initStyles(node) : initStyles

    applyStyles(node, {
      ...styles,
      transitionProperty: "",
      transitionDuration: "0ms",
      transitionDelay: "0ms",
    })
  }

  const runTransition = (node: TElement, items: number, index: number) => {
    const itemDelay = (DURATION / (items + 1)) * index
    const styles =
      targetStyles instanceof Function ? targetStyles(node) : targetStyles

    applyStyles(node, {
      ...styles,
      transitionProperty: toCssProperties(styles),
      transitionDuration: `${DURATION}ms`,
      transitionDelay: `${itemDelay}ms`,
      transitionTimingFunction: `cubic-bezier(${ease[timingFunction].join(",")})`,
    })
  }

  return {
    runTransition: ({
      node,
      items = 1,
      index = 0,
    }: InitTransitionProps<TElement>) => {
      if (!node) return
      initTransition(node)
      window.queueMicrotask(() => runTransition(node, items, index))
    },
  }
}
