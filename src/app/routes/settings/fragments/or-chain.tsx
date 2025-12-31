import { Children, Fragment, PropsWithChildren, HTMLProps } from "react"

import { Trans } from "@lingui/react/macro"

import { cn } from "utils/cn"
import { hstack } from "utils/styles"

export const OrChain = ({
  children,
  className,
  ...rest
}: PropsWithChildren<HTMLProps<HTMLDivElement>>) => (
  <div
    {...rest}
    className={cn(
      hstack({
        align: "center",
        justify: "evenly",
        gap: 4,
        wrap: true,
      }),
      "text-nowrap",
      className
    )}
  >
    {Children.map(children, (child, index) => (
      // eslint-disable-next-line react/no-array-index-key -- children will be static here
      <Fragment key={index}>
        {index !== 0 && (
          <span>
            <Trans>- or -</Trans>
          </span>
        )}
        {child}
      </Fragment>
    ))}
  </div>
)
