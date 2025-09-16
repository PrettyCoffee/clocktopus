import { PropsWithChildren } from "react"

import { ArrowLeft, Menu } from "lucide-react"

import { useMountAnimation } from "hooks/use-mount-animation"
import { createAtom, useAtomValue } from "lib/yaasl"
import { ClassNameProp, IconProp } from "types/base-props"
import { cn } from "utils/cn"
import { hstack, vstack } from "utils/styles"

import { IconButton } from "../ui/icon-button"

const Main = ({ children, className }: PropsWithChildren & ClassNameProp) => (
  <div className={cn(vstack({}), "h-full flex-1 overflow-auto", className)}>
    {children}
  </div>
)

interface SideAction extends Required<IconProp> {
  title: string
  href?: string
  onClick?: () => void
}

interface LayoutSideProps extends PropsWithChildren, ClassNameProp {
  back?: {
    href: string
    title: string
  }
  actions?: (SideAction | false | null | undefined)[]
}
const sideBarOpen = createAtom({ defaultValue: true })
const Side = ({ children, back, actions = [], className }: LayoutSideProps) => {
  const isOpen = useAtomValue(sideBarOpen)
  const toggle = () => sideBarOpen.set(open => !open)
  const animate = useMountAnimation({ open: isOpen, duration: 300 })

  const allActions: SideAction[] = [
    {
      title: isOpen ? "Collapse side menu" : "Expand side menu",
      onClick: toggle,
      icon: Menu,
    },
    back && { icon: ArrowLeft, ...back },
    ...actions,
  ].filter(action => !!action)

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
            "*:rounded-2xl"
          )}
        >
          {allActions.map(action => (
            <IconButton key={action.title} titleSide="right" {...action} />
          ))}
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
