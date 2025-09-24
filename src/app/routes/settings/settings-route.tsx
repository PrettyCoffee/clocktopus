import { Fragment } from "react/jsx-runtime"

import { VisuallyHidden } from "components/utility/visually-hidden"
import { cn } from "utils/cn"
import { hstack } from "utils/styles"

import { SettingsData } from "./settings-data"
import { SettingsProjects } from "./settings-projects"
import { SettingsTheming } from "./settings-theming"

const SectionHeader = ({ paths }: { paths: string[] }) => (
  <h2
    className={cn(
      hstack({ align: "center" }),
      "mt-4 mb-1 h-10 pl-2 text-2xl font-bold first-of-type:mt-0"
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

const SettingsRoute = () => (
  <>
    <VisuallyHidden>
      <h1>Settings</h1>
    </VisuallyHidden>
    <div className="mx-auto w-full max-w-2xl pb-4">
      <SectionHeader paths={["Settings", "Theming"]} />
      <SettingsTheming />

      <SectionHeader paths={["Settings", "Projects"]} />
      <SettingsProjects />

      <SectionHeader paths={["Settings", "Data"]} />
      <SettingsData />
    </div>
  </>
)

export default SettingsRoute
