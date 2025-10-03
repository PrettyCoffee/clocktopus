import { FC, lazy, Suspense } from "react"

import { MainErrorFallback } from "components/errors/main"
import { Spinner } from "components/ui/spinner"
import { ErrorBoundary } from "components/utility/error-boundary"

import { AppProviders } from "./providers"
import { PageChangedRoute } from "./routes/page-changed"

const fallback = { default: PageChangedRoute }
const safeLazy = <T extends FC<unknown>>(load: () => Promise<{ default: T }>) =>
  lazy<T>(async () => {
    try {
      return await load()
    } catch (e) {
      console.error(e)
      return fallback as unknown as { default: T }
    }
  })

const PageLoading = () => (
  <div className="grid size-full place-items-center">
    <Spinner size="xl" />
  </div>
)

const AppRouter = safeLazy(() => import("./router"))

export const App = () => (
  <ErrorBoundary Fallback={MainErrorFallback}>
    <AppProviders>
      <Suspense fallback={<PageLoading />}>
        <AppRouter />
      </Suspense>
    </AppProviders>
  </ErrorBoundary>
)
