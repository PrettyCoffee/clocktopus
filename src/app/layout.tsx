import { PropsWithChildren, Suspense } from "react"

import { MainErrorFallback } from "components/errors/main"
import { Layout } from "components/layouts/layout"
import { Spinner } from "components/ui/spinner"
import { ErrorBoundary } from "components/utility/error-boundary"

export const AppLayout = ({ children }: PropsWithChildren) => (
  <Layout.Root>
    <Layout.Side></Layout.Side>
    <Layout.Main>
      <Suspense fallback={<Spinner size="xl" />}>
        <ErrorBoundary Fallback={MainErrorFallback}>{children}</ErrorBoundary>
      </Suspense>
    </Layout.Main>
  </Layout.Root>
)
