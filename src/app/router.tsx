import { lazy } from "react"

import { Router, Route, Switch } from "wouter"
import { useHashLocation } from "wouter/use-hash-location"

import { AppLayout } from "./layout"
import { NotFoundRoute } from "./routes/not-found"

export const AppRouter = () => (
  <Router hook={useHashLocation}>
    <AppLayout>
      <Switch>
        <Route
          path="settings"
          component={lazy(() => import("./routes/settings/settings-route"))}
        />
        <Route component={NotFoundRoute} />
      </Switch>
    </AppLayout>
  </Router>
)
