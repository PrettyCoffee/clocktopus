import { Children, Fragment, PropsWithChildren } from "react"

import { cn } from "utils/cn"
import { hstack } from "utils/styles"

export const OrChain = ({ children }: PropsWithChildren) => (
  <div
    className={cn(
      hstack({
        align: "center",
        justify: "evenly",
        gap: 4,
        wrap: true,
      }),
      "text-nowrap"
    )}
  >
    {Children.map(children, (child, index) => (
      // eslint-disable-next-line react/no-array-index-key -- children will be static here
      <Fragment key={index}>
        {index !== 0 && <span>- or -</span>}
        {child}
      </Fragment>
    ))}
  </div>
)
