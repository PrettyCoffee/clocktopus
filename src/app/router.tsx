import { FC, lazy } from "react"

import { Router, Route, Switch } from "wouter"
import { useHashLocation } from "wouter/use-hash-location"

import { AppLayout } from "./layout"
import { NotFoundRoute } from "./routes/not-found"
import { PageChangedRoute } from "./routes/page-changed"

const fallback = { default: PageChangedRoute }
const safeLazy = <T extends FC<unknown>>(load: () => Promise<{ default: T }>) =>
  lazy<T>(async () => {
    try {
      return await load()
    } catch {
      return fallback as unknown as { default: T }
    }
  })

export const AppRouter = () => (
  <Router hook={useHashLocation}>
    <AppLayout>
      <Switch>
        <Route
          path="/settings"
          component={safeLazy(() => import("./routes/settings/settings-route"))}
        />
        <Route
          path="/"
          component={safeLazy(() => import("./routes/main/main-route"))}
        />
        <Route component={NotFoundRoute} />
      </Switch>
    </AppLayout>
  </Router>
)
