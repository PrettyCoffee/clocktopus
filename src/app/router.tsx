import { FC, lazy } from "react"

import { AppLayout } from "./layout"
import { NotFoundRoute } from "./routes/not-found"

const routes: Record<string, FC> = {
  "#settings": lazy(() => import("./routes/settings/settings-route")),
}

const Route = routes[window.location.hash] ?? NotFoundRoute

export const AppRouter = () => (
  <AppLayout>
    <Route />
  </AppLayout>
)
