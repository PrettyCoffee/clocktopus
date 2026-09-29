import { type PropsWithChildren, type ReactNode } from "react"

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
        "bg-background-page text-text-gentle absolute -top-2 left-6 h-8 rounded-md px-2 text-sm",
      )}
    >
      {title}
    </div>
    <div className="border-stroke-gentle rounded-lg border p-4">{children}</div>
  </div>
)
