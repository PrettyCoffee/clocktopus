import { Fragment } from "react/jsx-runtime"
import { Route, Switch } from "wouter"

import { VisuallyHidden } from "components/utility/visually-hidden"
import { cn } from "utils/cn"
import { hstack } from "utils/styles"

import { SettingsData } from "./settings-data"
import { SettingsGeneral } from "./settings-general"
import { SettingsProjects } from "./settings-projects"
import { SettingsTheming } from "./settings-theming"

const SectionHeader = ({ paths }: { paths: string[] }) => (
  <h2
    className={cn(
      hstack({ align: "center" }),
      "mt-4 mb-1 h-10 pl-2 text-2xl font-bold first-of-type:mt-6"
    )}
  >
    {paths.map((title, index) => (
      <Fragment key={title}>
        {index !== 0 && (
          <span className="after:mx-2 after:text-text-gentle after:content-['>']" />
        )}
        {title}
      </Fragment>
    ))}
  </h2>
)

export const settingPages = [
  { path: "/general", title: "General", Component: SettingsGeneral },
  { path: "/theming", title: "Theming", Component: SettingsTheming },
  { path: "/projects", title: "Projects", Component: SettingsProjects },
  { path: "/data", title: "Data", Component: SettingsData },
]

export const SettingsRoute = () => (
  <>
    <VisuallyHidden>
      <h1>Settings</h1>
    </VisuallyHidden>
    <div className="mx-auto w-full max-w-2xl pb-4">
      <Switch>
        {settingPages.map(({ path, title, Component }) => (
          <Route key={path} path={path}>
            <SectionHeader paths={["Settings", title]} />
            <Component />
          </Route>
        ))}

        <Route path="">
          {settingPages.map(({ path, title, Component }) => (
            <Fragment key={path}>
              <SectionHeader paths={["Settings", title]} />
              <Component />
            </Fragment>
          ))}
        </Route>
      </Switch>
    </div>
  </>
)
