import { ReactNode } from "react"

import { i18n } from "@lingui/core"
import { msg } from "@lingui/core/macro"
import { Settings, ClockFading, ChartNoAxesColumn, Search } from "lucide-react"
import { useHashLocation } from "wouter/use-hash-location"

import { PageCrashedRoute } from "app/routes/page-crashed"
import { Layout } from "components/layouts/layout"
import { Github } from "components/ui/icon"
import { IconButton } from "components/ui/icon-button"
import { ErrorBoundary } from "components/utility/error-boundary"

const routes = [
  { to: "/", title: msg`Time Tracker`, icon: ClockFading },
  { to: "/search", title: msg`Search`, icon: Search },
  { to: "/stats", title: msg`Stats`, icon: ChartNoAxesColumn },
  { to: "/settings", title: msg`Settings`, icon: Settings },
  {
    href: "https://github.com/PrettyCoffee/clocktopus",
    title: msg`Github`,
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
          title={i18n._(props.title)}
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
      <ErrorBoundary Fallback={PageCrashedRoute}>{sideContent}</ErrorBoundary>
    </Layout.Side>

    <Layout.Main>
      <ErrorBoundary Fallback={PageCrashedRoute}>{mainContent}</ErrorBoundary>
    </Layout.Main>
  </Layout.Root>
)
