import { ReactNode } from "react"

import { Settings, ClockFading, ChartNoAxesColumn, Search } from "lucide-react"
import { useHashLocation } from "wouter/use-hash-location"

import { MainErrorFallback } from "components/errors/main"
import { Layout } from "components/layouts/layout"
import { Github } from "components/ui/icon"
import { IconButton } from "components/ui/icon-button"
import { ErrorBoundary } from "components/utility/error-boundary"

const routes = [
  { to: "/", title: "Time Tracker", icon: ClockFading },
  { to: "/search", title: "Search", icon: Search },
  { to: "/stats", title: "Stats", icon: ChartNoAxesColumn },
  { to: "/settings", title: "Settings", icon: Settings },
  {
    href: "https://github.com/PrettyCoffee/clocktopus",
    title: "Github",
    icon: Github,
    target: "_blank",
  },
]

const SideActions = () => {
  const [path] = useHashLocation()

  const isActive = (to?: string) =>
    !to ? false : to.split("/").find(Boolean) === path.split("/").find(Boolean)

  return (
    <>
      {routes.map(props => (
        <IconButton
          key={props.to ?? props.href}
          {...props}
          titleSide="right"
          active={isActive(props.to)}
        />
      ))}
    </>
  )
}

interface AppLayoutProps {
  mainContent: ReactNode
  sideContent: ReactNode
}
export const AppLayout = ({ mainContent, sideContent }: AppLayoutProps) => (
  <Layout.Root>
    <Layout.Side actions={<SideActions />}>
      <ErrorBoundary Fallback={MainErrorFallback}>{sideContent}</ErrorBoundary>
    </Layout.Side>

    <Layout.Main>
      <ErrorBoundary Fallback={MainErrorFallback}>{mainContent}</ErrorBoundary>
    </Layout.Main>
  </Layout.Root>
)
