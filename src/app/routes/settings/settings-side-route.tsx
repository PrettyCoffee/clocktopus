import { useHashLocation } from "wouter/use-hash-location"

import { Button } from "components/ui/button"
import { cn } from "utils/cn"
import { vstack } from "utils/styles"

import { settingPages } from "./settings-route"

const routes = {
  main: { path: "/settings", title: "Settings" },
  subRoutes: settingPages.map(({ path, title }) => ({
    path: `/settings${path}`,
    title,
  })),
}

export const SettingsSideRoute = () => {
  const [path] = useHashLocation()

  return (
    <div className={cn(vstack({}), "[&_:where(button,a)]:justify-start")}>
      <Button to={routes.main.path} active={path === routes.main.path}>
        {routes.main.title}
      </Button>

      <div
        className={cn(
          vstack({}),
          "mt-2 ml-2 border-l border-l-stroke-gentle pl-2"
        )}
      >
        {routes.subRoutes.map(route => (
          <Button key={route.path} to={route.path} active={path === route.path}>
            {route.title}
          </Button>
        ))}
      </div>
    </div>
  )
}
