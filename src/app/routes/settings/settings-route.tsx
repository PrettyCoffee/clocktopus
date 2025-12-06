import { Fragment } from "react/jsx-runtime"
import { Route, Switch } from "wouter"

import { cn } from "utils/cn"
import { hstack } from "utils/styles"

import { SettingsCategories } from "./settings-categories"
import { SettingsData } from "./settings-data"
import { SettingsGeneral } from "./settings-general"
import { SettingsTheming } from "./settings-theming"

const SectionHeader = ({ title }: { title: string }) => (
  <h2
    className={cn(
      hstack({ align: "center" }),
      "mt-4 mb-1 h-10 pl-2 text-2xl font-bold first-of-type:mt-6"
    )}
  >
    <span className="opacity-25 after:mx-2 after:text-highlight after:content-['>']" />
    {title}
  </h2>
)

const SettingsHeader = () => (
  <div className="@container mx-auto flex w-full max-w-2xl items-center justify-between px-10 pt-10 pb-6">
    <h1 className="text-[min(calc(15cqw),5rem)] font-bold text-highlight/15">
      Settings
    </h1>
    <div className="relative size-[min(5rem,25cqw)] shrink-0">
      <img
        className="absolute inset-0 min-h-full min-w-full opacity-75 blur-[3cqh]"
        src="./octopus.png"
        aria-hidden
        alt=""
      />
      <img
        className="absolute inset-0 z-1 size-full drop-shadow-md"
        src="./octopus.png"
        alt="cute octopus emoji"
      />
    </div>
  </div>
)

export const settingPages = [
  { path: "/general", title: "General", Component: SettingsGeneral },
  { path: "/theming", title: "Theming", Component: SettingsTheming },
  { path: "/categories", title: "Categories", Component: SettingsCategories },
  { path: "/data", title: "Data", Component: SettingsData },
]

export const SettingsRoute = () => (
  <div className="mx-auto w-full max-w-2xl pb-4">
    <SettingsHeader />

    <Switch>
      {settingPages.map(({ path, title, Component }) => (
        <Route key={path} path={path}>
          <SectionHeader title={title} />
          <Component />
        </Route>
      ))}

      <Route path="">
        {settingPages.map(({ path, title, Component }) => (
          <Fragment key={path}>
            <SectionHeader title={title} />
            <Component />
          </Fragment>
        ))}
      </Route>
    </Switch>
  </div>
)
