import { PropsWithChildren, Suspense } from "react"

import { ArrowLeft, History, Settings } from "lucide-react"
import { useHashLocation } from "wouter/use-hash-location"

import { MainErrorFallback } from "components/errors/main"
import { Layout } from "components/layouts/layout"
import { Github } from "components/ui/icon"
import { IconButton } from "components/ui/icon-button"
import { Spinner } from "components/ui/spinner"
import { ErrorBoundary } from "components/utility/error-boundary"
import { DateSelection } from "features/date-selection"
import { cn } from "utils/cn"
import { hstack } from "utils/styles"

const PageLoading = () => (
  <div className="grid size-full place-items-center">
    <Spinner size="xl" />
  </div>
)

export const AppLayout = ({ children }: PropsWithChildren) => {
  const [path] = useHashLocation()
  const isSettingsRoute = path.endsWith("settings")

  return (
    <Layout.Root>
      <Layout.Side
        actions={
          isSettingsRoute ? (
            <IconButton key="back" title="Back" icon={ArrowLeft} to="" />
          ) : (
            <IconButton
              key="settings"
              title="Settings"
              icon={Settings}
              to="settings"
            />
          )
        }
      >
        <div className="flex-1 overflow-y-auto">
          <DateSelection years={[2025, 2024]} />
        </div>
        <div className={cn(hstack({ gap: 1 }), "ml-4 *:flex-1")}>
          <IconButton
            icon={Github}
            title="Github Repository"
            href="https://github.com/PrettyCoffee/clocktopus"
            target="_blank"
          />
          <IconButton icon={History} title="Changelog" />
        </div>
      </Layout.Side>
      <Layout.Main>
        <Suspense fallback={<PageLoading />}>
          <ErrorBoundary Fallback={MainErrorFallback}>{children}</ErrorBoundary>
        </Suspense>
      </Layout.Main>
    </Layout.Root>
  )
}
