import { PropsWithChildren, Suspense } from "react"

import { ArrowLeft, Settings } from "lucide-react"
import { useHashLocation } from "wouter/use-hash-location"

import { MainErrorFallback } from "components/errors/main"
import { Layout } from "components/layouts/layout"
import { Spinner } from "components/ui/spinner"
import { ErrorBoundary } from "components/utility/error-boundary"

export const AppLayout = ({ children }: PropsWithChildren) => {
  const [path] = useHashLocation()
  const isSettingsRoute = path.endsWith("settings")

  return (
    <Layout.Root>
      <Layout.Side
        actions={
          isSettingsRoute
            ? { title: "Back", icon: ArrowLeft, to: "" }
            : { title: "Settings", icon: Settings, to: "settings" }
        }
      ></Layout.Side>
      <Layout.Main>
        <Suspense fallback={<Spinner size="xl" />}>
          <ErrorBoundary Fallback={MainErrorFallback}>{children}</ErrorBoundary>
        </Suspense>
      </Layout.Main>
    </Layout.Root>
  )
}
