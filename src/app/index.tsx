import { PageCrashedRoute } from "app/routes/page-crashed"
import { ErrorBoundary } from "components/utility/error-boundary"

import { AppProviders } from "./providers"
import { AppRouter } from "./router"

export const App = () => (
  <ErrorBoundary Fallback={PageCrashedRoute}>
    <AppProviders>
      <AppRouter />
    </AppProviders>
  </ErrorBoundary>
)
