import { PropsWithChildren, Suspense } from "react"

import { Settings, ClockFading, ChartNoAxesColumn } from "lucide-react"
import { useHashLocation } from "wouter/use-hash-location"

import { MainErrorFallback } from "components/errors/main"
import { Layout } from "components/layouts/layout"
import { Github } from "components/ui/icon"
import { IconButton } from "components/ui/icon-button"
import { Spinner } from "components/ui/spinner"
import { ErrorBoundary } from "components/utility/error-boundary"
import { DateSelection } from "features/date-selection"

const routes = [
  { to: "/", title: "Time Tracker", icon: ClockFading },
  { to: "/stats", title: "Stats", icon: ChartNoAxesColumn, disabled: true },
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

  return (
    <>
      {routes.map(props => (
        <IconButton
          key={props.to ?? props.href}
          {...props}
          titleSide="right"
          active={path === props.to}
        />
      ))}
    </>
  )
}

const SideContent = () => {
  const [path] = useHashLocation()

  if (path === "/") return <DateSelection />

  if (path === "/settings") {
    /* TODO: Add some sub navigation */
  }

  return null
}

const PageLoading = () => (
  <div className="grid size-full place-items-center">
    <Spinner size="xl" />
  </div>
)

export const AppLayout = ({ children }: PropsWithChildren) => (
  <Layout.Root>
    <Layout.Side actions={<SideActions />}>
      <SideContent />
    </Layout.Side>

    <Layout.Main>
      <Suspense fallback={<PageLoading />}>
        <ErrorBoundary Fallback={MainErrorFallback}>{children}</ErrorBoundary>
      </Suspense>
    </Layout.Main>
  </Layout.Root>
)
