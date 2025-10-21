import { PropsWithChildren, ReactNode } from "react"

import { Menu } from "lucide-react"

import { useMountAnimation } from "hooks/use-mount-animation"
import { createAtom, sessionStorage, useAtomValue } from "lib/yaasl"
import { ClassNameProp } from "types/base-props"
import { cn } from "utils/cn"
import { hstack, vstack } from "utils/styles"

import { IconButton } from "../ui/icon-button"

const Main = ({ children, className }: PropsWithChildren & ClassNameProp) => (
  <div className={cn(vstack({}), "h-full flex-1 overflow-auto", className)}>
    <div className="mx-auto size-full max-w-7xl">{children}</div>
  </div>
)

interface LayoutSideProps extends PropsWithChildren, ClassNameProp {
  actions?: ReactNode
}
const sideBarOpen = createAtom({
  defaultValue: false,
  effects: [sessionStorage()],
})

const Side = ({ children, actions = [], className }: LayoutSideProps) => {
  const isOpen = useAtomValue(sideBarOpen)
  const toggle = () => sideBarOpen.set(open => !open)
  const animate = useMountAnimation({ open: isOpen, duration: 300 })

  return (
    <div className="px-5 py-2">
      <div
        className={cn(
          vstack(),
          "relative -ml-5 h-full py-3 pr-7 pl-3",
          "rounded-r-lg border-y border-r border-stroke-gentle",
          "transition-[max-width,min-width,padding] duration-0 ease-in-out motion-safe:duration-300",
          isOpen
            ? "min-w-[clamp(theme(width.64),20vw,theme(width.80))] max-w-[clamp(theme(width.64),20vw,theme(width.80))]"
            : "min-w-0 max-w-0 pr-3",
          className
        )}
      >
        <div
          className={cn(
            vstack({ gap: 2, align: "stretch" }),
            "-m-2 flex-1 overflow-y-scroll p-2 transition-opacity duration-0 motion-safe:duration-300",
            animate.state !== "open" && "overflow-hidden **:overflow-hidden",
            isOpen ? "opacity-100" : "opacity-0"
          )}
        >
          {animate.mounted && children}
        </div>

        <div
          className={cn(
            vstack({}),
            "absolute top-3 -right-5 rounded-2xl border border-stroke-gentle bg-background-page",
            "[&_:where(button,a)]:size-10 [&_:where(button,a)]:rounded-2xl [&_:where(button,a)_svg]:size-5"
          )}
        >
          <IconButton
            icon={Menu}
            title={isOpen ? "Collapse side menu" : "Expand side menu"}
            titleSide="right"
            onClick={toggle}
          />
          {actions}
        </div>
      </div>
    </div>
  )
}

const Root = ({ children, className }: PropsWithChildren & ClassNameProp) => (
  <div className={cn(hstack({}), "size-full", className)}>{children}</div>
)

export const Layout = {
  Root,
  Side,
  Main,
}
