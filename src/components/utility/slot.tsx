import {
  type CSSProperties,
  type HTMLAttributes,
  type PropsWithChildren,
  type Ref,
  type RefCallback,
  cloneElement,
  isValidElement,
} from "react"

const isFunction = (value: unknown): value is (...args: unknown[]) => unknown =>
  typeof value === "function"

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null

const mergeRefs = <T,>(...refs: unknown[]): RefCallback<T> | undefined => {
  if (refs.every(ref => ref == null)) {
    return
  }

  return (value: T | null) => {
    refs.forEach(ref => {
      if (!ref) return

      if (isFunction(ref)) {
        ref(value)
      } else if (isObject(ref) && "current" in ref) {
        ref["current"] = value
      }
    })
  }
}

const mergeFunctions =
  (slotFn: unknown, childFn: unknown) =>
  (...args: unknown[]) => {
    if (isFunction(slotFn)) slotFn(...args)
    if (isFunction(childFn)) childFn(...args)
  }

const mergeClassNames = (slot: unknown, child: unknown) =>
  [child, slot]
    .filter(className => className && typeof className === "string")
    .join(" ")

const mergeStyles = (slot: CSSProperties, child: CSSProperties) => ({
  ...slot,
  ...child,
})

const mergeProps = (
  slotProps: Record<string, unknown>,
  childProps: Record<string, unknown>
) => {
  const result: Record<string, unknown> = { ...childProps }

  for (const key in slotProps) {
    const slotValue = slotProps[key]
    const childValue = childProps[key]

    if (key === "ref") {
      result[key] = mergeRefs(slotValue, childValue)
    } else if (key === "className") {
      result[key] = mergeClassNames(slotValue, childValue)
    } else if (key === "style" && isObject(slotValue) && isObject(childValue)) {
      result[key] = mergeStyles(slotValue, childValue)
    } else if (/^on[A-Z]/.test(key)) {
      result[key] = mergeFunctions(slotValue, childValue)
    } else {
      result[key] = childValue ?? slotValue
    }
  }

  return result
}

type SlotProps = PropsWithChildren<
  HTMLAttributes<HTMLElement> & {
    ref?: Ref<HTMLElement>
  }
>

export const Slot = ({ children, ...slotProps }: SlotProps) => {
  if (!isValidElement(children)) {
    throw new Error("Slot requires a single React element as child.")
  }

  return cloneElement(
    children,
    mergeProps(
      slotProps as Record<string, unknown>,
      children.props as Record<string, unknown>
    )
  )
}
