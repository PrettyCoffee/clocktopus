import {
  ButtonHTMLAttributes,
  HTMLAttributeAnchorTarget,
  KeyboardEventHandler,
  PropsWithChildren,
} from "react"

import { cva, type VariantProps } from "class-variance-authority"
import { Link } from "wouter"

import { Slot } from "components/utility/slot"
import {
  AsChildProp,
  ClassNameProp,
  DisableProp,
  IconProp,
  RefProp,
} from "types/base-props"
import { cn } from "utils/cn"
import { interactive, InteractiveProps } from "utils/styles"

import { Icon, IconProps } from "../icon"
import { Spinner } from "../spinner"

const button = cva(
  cn(
    "relative inline-flex shrink-0 items-center justify-center rounded-md text-sm font-medium whitespace-nowrap"
  ),
  {
    variants: {
      size: {
        md: "h-10 px-3",
        sm: "h-8 px-2",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

type ButtonHtmlProps = ButtonHTMLAttributes<HTMLButtonElement>

export interface ButtonProps
  extends
    Pick<ButtonHtmlProps, "onClick" | "onFocus" | "onBlur">,
    RefProp<HTMLButtonElement>,
    IconProp,
    ClassNameProp,
    AsChildProp,
    DisableProp,
    VariantProps<typeof button>,
    InteractiveProps {
  isLoading?: boolean
  href?: string
  target?: HTMLAttributeAnchorTarget
  to?: string
  iconColor?: IconProps["color"]
  onKeyDown?: KeyboardEventHandler<HTMLButtonElement>
}

export const Button = ({
  ref,
  className,
  look = "flat",
  size = "md",
  asChild = false,
  children,
  isLoading,
  icon,
  iconColor = "current",
  active,
  disabled,
  ...props
  // eslint-disable-next-line complexity
}: PropsWithChildren<ButtonProps>) => {
  const Comp = asChild
    ? Slot
    : props.to != null
      ? Link
      : props.href != null
        ? "a"
        : "button"

  return (
    <Comp
      {...props}
      // @ts-expect-error -- the ref type shouldn't matter too much here
      ref={ref}
      disabled={disabled}
      aria-selected={active}
      className={cn(
        interactive({ look, active, disabled }),
        button({ size, className })
      )}
    >
      {isLoading ? (
        <Spinner size="sm" color="current" className="mr-2" />
      ) : icon ? (
        <Icon
          color={iconColor}
          icon={icon}
          size={size === "sm" ? "xs" : "sm"}
          className="mr-2"
        />
      ) : null}
      {children}
    </Comp>
  )
}
