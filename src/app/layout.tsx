import { PropsWithChildren, Suspense } from "react"

import { ArrowLeft, Settings } from "lucide-react"

import { MainErrorFallback } from "components/errors/main"
import { Layout } from "components/layouts/layout"
import { Spinner } from "components/ui/spinner"
import { ErrorBoundary } from "components/utility/error-boundary"

const isSettings = !!window.location.hash

export const AppLayout = ({ children }: PropsWithChildren) => (
  <Layout.Root>
    <Layout.Side
      actions={
        isSettings
          ? { title: "Back", icon: ArrowLeft, href: "/" }
          : { title: "Settings", icon: Settings, href: "/#settings" }
      }
    ></Layout.Side>
    <Layout.Main>
      <Suspense fallback={<Spinner size="xl" />}>
        <ErrorBoundary Fallback={MainErrorFallback}>{children}</ErrorBoundary>
      </Suspense>
    </Layout.Main>
  </Layout.Root>
)
