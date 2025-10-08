import { PropsWithChildren, ReactNode } from "react"

import { cn } from "utils/cn"
import { hstack } from "utils/styles"

export const Container = ({
  title,
  children,
}: PropsWithChildren<{ title: ReactNode }>) => (
  <div className="relative p-2">
    <div
      className={cn(
        hstack({ align: "center" }),
        "absolute -top-2 left-6 h-8 rounded-md bg-background-page px-2 text-sm text-text-gentle"
      )}
    >
      {title}
    </div>
    <div className="rounded-lg border border-stroke-gentle p-4">{children}</div>
  </div>
)
