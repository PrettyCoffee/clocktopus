import { Suspense, use } from "react"

import { PageCrashedRoute } from "app/routes/page-crashed"
import { ErrorBoundary } from "components/utility/error-boundary"
import { didAllDataInit } from "data/did-all-data-init"

import { AppProviders } from "./providers"
import { AppRouter } from "./router"

const allDataLoadded = didAllDataInit()
const AwaitData = () => {
  use(allDataLoadded)
  return null
}

export const App = () => (
  <ErrorBoundary Fallback={PageCrashedRoute}>
    <Suspense fallback={null}>
      <AwaitData />
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </Suspense>
  </ErrorBoundary>
)
