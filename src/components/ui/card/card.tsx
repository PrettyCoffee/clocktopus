import { type PropsWithChildren, type ReactNode } from "react"

import { type ClassNameProp } from "types/base-props"
import { cn } from "utils/cn"
import { surface } from "utils/styles"

interface CardProps extends ClassNameProp {
  title: ReactNode | string
  description: ReactNode | string
  Headline?: "h2" | "h3"
}

export const Card = ({
  title,
  description,
  children,
  Headline = "h3",
  className,
}: PropsWithChildren<CardProps>) => (
  <div className="p-2">
    <div
      className={cn(
        surface({ look: "card", size: "lg" }),
        "p-4 pt-2",
        className,
      )}
    >
      <Headline className="text-text-priority mb-1 font-bold">{title}</Headline>
      {description && (
        <p className={cn("text-text-gentle text-sm", children && "mb-4")}>
          {description}
        </p>
      )}
      {children}
    </div>
  </div>
)
