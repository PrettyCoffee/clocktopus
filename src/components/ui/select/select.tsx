"use client"

import { Dispatch, PropsWithChildren } from "react"

import * as Primitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { ClassNameProp, DisableProp } from "types/base-props"
import { cn } from "utils/cn"
import { hstack, interactive, surface } from "utils/styles"
import { zIndex } from "utils/z-index"

import { Button } from "../button"
import { Icon } from "../icon"

interface TriggerProps extends ClassNameProp {
  placeholder: string
}
const Trigger = ({ placeholder, className }: TriggerProps) => (
  <Primitive.Trigger asChild>
    <Button
      className={cn(
        "gap-2 border border-stroke-gentle data-[placeholder]:text-text-muted",
        "[&_svg]:transition [&_svg]:duration-400 [&_svg]:ease-bounce data-[state='open']:[&_svg]:rotate-180",
        className
      )}
    >
      <Primitive.Value placeholder={placeholder} />
      <Primitive.Icon asChild>
        <Icon icon={ChevronDown} size="sm" color="gentle" />
      </Primitive.Icon>
    </Button>
  </Primitive.Trigger>
)

const ScrollUpButton = () => (
  <Primitive.ScrollUpButton
    className={cn("flex cursor-default items-center justify-center py-1")}
  >
    <Icon icon={ChevronUp} size="sm" />
  </Primitive.ScrollUpButton>
)

const ScrollDownButton = () => (
  <Primitive.ScrollDownButton
    className={cn("flex cursor-default items-center justify-center py-1")}
  >
    <Icon icon={ChevronDown} size="sm" />
  </Primitive.ScrollDownButton>
)

const Content = ({ children }: PropsWithChildren) => (
  <Primitive.Portal>
    <Primitive.Content
      position="popper"
      side="bottom"
      sideOffset={4}
      align="start"
      className={cn(
        zIndex.popover,
        surface({ look: "overlay", size: "lg" }),
        "relative max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-x-hidden overflow-y-auto p-0",
        "origin-(--radix-select-content-transform-origin) data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
      )}
    >
      <ScrollUpButton />
      <Primitive.Viewport
        className={cn(
          "p-1",
          "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
        )}
      >
        {children}
      </Primitive.Viewport>
      <ScrollDownButton />
    </Primitive.Content>
  </Primitive.Portal>
)

interface OptionProps extends DisableProp, ClassNameProp {
  value: string
  label?: string
}
const Option = ({ value, label = value, disabled, className }: OptionProps) => (
  <Primitive.Item
    value={value}
    textValue={label}
    disabled={disabled}
    className={cn(
      interactive({ disabled }),
      hstack({ align: "center", gap: 2 }),
      "outline-none focus-visible:text-highlight",
      "relative h-8 w-full rounded-md pr-8 pl-2 text-sm select-none",
      className
    )}
  >
    <Primitive.ItemText>{label}</Primitive.ItemText>
    <span className="absolute right-2 flex size-3.5 items-center justify-center">
      <Primitive.ItemIndicator>
        <Icon icon={Check} size="sm" />
      </Primitive.ItemIndicator>
    </span>
  </Primitive.Item>
)

interface GroupProps {
  label: string
  labelClassName?: string
}
const Group = ({
  label,
  labelClassName,
  children,
}: PropsWithChildren<GroupProps>) => (
  <Primitive.Group>
    <Primitive.Label
      className={cn("px-2 py-1.5 text-xs text-text-gentle", labelClassName)}
    >
      {label}
    </Primitive.Label>

    {children}

    <Primitive.Separator
      className={cn(
        "pointer-events-none m-1 h-px bg-stroke-gentle",
        "[:last-child>&]:hidden"
      )}
    />
  </Primitive.Group>
)

interface SelectRootProps extends ClassNameProp {
  placeholder: string
  value: string
  onChange: Dispatch<string>
}
const Root = ({
  children,
  placeholder,
  value,
  onChange,
  className,
}: PropsWithChildren<SelectRootProps>) => (
  <Primitive.Root value={value} onValueChange={onChange}>
    <Trigger placeholder={placeholder} className={className} />
    <Content>{children}</Content>
  </Primitive.Root>
)

export const Select = {
  Root,
  Group,
  Option,
}
