import { ReactNode } from "react"

import { msg } from "@lingui/core/macro"
import {
  Settings,
  ClockFading,
  ChartNoAxesColumn,
  Search,
  CalendarRange,
} from "lucide-react"
import { useHashLocation } from "wouter/use-hash-location"

import { PageCrashedRoute } from "app/routes/page-crashed"
import { Layout } from "components/layouts/layout"
import { Github } from "components/ui/icon"
import { IconButton } from "components/ui/icon-button"
import { ErrorBoundary } from "components/utility/error-boundary"
import { preferencesData } from "data/preferences"
import { useAtom } from "lib/yaasl"
import { useTrans } from "locales/locale-provider"

export const routes = [
  { to: "/", title: msg`Time Tracker`, icon: ClockFading },
  { to: "/calendar", title: msg`Calendar View`, icon: CalendarRange },
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
  const trans = useTrans()
  const { hiddenRoutes = [] } = useAtom(preferencesData)

  const visibleRoutes = routes.filter(
    route => !hiddenRoutes.includes(route.to ?? route.href)
  )

  const isActive = (to?: string) =>
    !to ? false : to.split("/").find(Boolean) === path.split("/").find(Boolean)

  return (
    <>
      {visibleRoutes.map(props => (
        <IconButton
          key={props.to ?? props.href}
          {...props}
          title={trans(props.title)}
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
