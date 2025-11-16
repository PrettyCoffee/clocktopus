import { PropsWithChildren, useId, ReactNode, isValidElement } from "react"

import { Slot } from "@radix-ui/react-slot"

import { ClassNameProp } from "types/base-props"
import { cn } from "utils/cn"
import { vstack } from "utils/styles"

interface InputLabelProps extends ClassNameProp {
  label: string
  htmlFor?: string
  children?: ((id: string) => ReactNode) | ReactNode
}

export const InputLabel = ({
  label,
  htmlFor,
  children,
  className,
}: PropsWithChildren<InputLabelProps>) => {
  const internalId = useId()
  const id = htmlFor ?? internalId

  const content =
    typeof children === "function" ? (
      children(id)
    ) : isValidElement(children) ? (
      <Slot id={id}>{children}</Slot>
    ) : (
      children
    )

  return (
    <div className={cn(vstack({ gap: 1 }), "py-2", className)}>
      <label
        htmlFor={id}
        className={cn(
          "w-max truncate text-sm font-semibold text-text-gentle",
          className
        )}
      >
        {label}
      </label>

      {content}
    </div>
  )
}
