import { Route, Switch } from "wouter"

import { AppLayout } from "./layout"
import { MainRoute } from "./routes/main/main-route"
import { MainSideRoute } from "./routes/main/main-side-route"
import { NotFoundRoute } from "./routes/not-found"
import { SearchRoute } from "./routes/search/search-route"
import { SettingsRoute } from "./routes/settings/settings-route"
import { SettingsSideRoute } from "./routes/settings/settings-side-route"
import { StatsRoute } from "./routes/stats/stats-route"
import { StatsSideRoute } from "./routes/stats/stats-side-route"

const AppRouter = () => (
  <AppLayout
    sideContent={
      <Switch>
        <Route path="/settings/*" component={SettingsSideRoute} />
        <Route path="/settings" component={SettingsSideRoute} />
        <Route path="/stats" component={StatsSideRoute} />
        <Route path="/" component={MainSideRoute} />
      </Switch>
    }
    mainContent={
      <Switch>
        <Route path="/settings" nest component={SettingsRoute} />
        <Route path="/search" component={SearchRoute} />
        <Route path="/stats" component={StatsRoute} />
        <Route path="/" component={MainRoute} />
        <Route component={NotFoundRoute} />
      </Switch>
    }
  />
)

export default AppRouter
