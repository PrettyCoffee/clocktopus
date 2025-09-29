import { Dispatch, PropsWithChildren } from "react"

import { Link } from "wouter"

import { DateInput } from "components/ui/date-input"
import { Input } from "components/ui/input"
import { Select } from "components/ui/select"
import { TimeInput } from "components/ui/time-input"
import {
  categoriesWithProjects,
  CategoryWithProjects,
  Project,
  ProjectCategory,
} from "data/projects"
import { type TimeEntry } from "data/time-entries"
import { useAtomValue } from "lib/yaasl"
import { ClassNameProp } from "types/base-props"
import { cn } from "utils/cn"
import { getLocale } from "utils/get-locale"
import { colored } from "utils/styles"
import { today } from "utils/today"

interface InputProps extends ClassNameProp {
  entry: TimeEntry
  onChange: Dispatch<Partial<TimeEntry>>
}

const Description = ({ entry, className, onChange, ...rest }: InputProps) => (
  <Input
    {...rest}
    type="text"
    placeholder="Description"
    className={cn("flex-1", className)}
    value={entry.description}
    onChange={description => onChange({ description })}
  />
)

const DateComp = ({ entry, onChange, ...rest }: InputProps) => (
  <DateInput
    {...rest}
    locale={getLocale()}
    value={entry.date}
    max={today()}
    onChange={date => onChange({ date })}
  />
)

const TimeStart = ({ entry, onChange, ...rest }: InputProps) => (
  <TimeInput
    {...rest}
    value={entry.start}
    onChange={start => onChange({ start })}
  />
)
const TimeEnd = ({ entry, onChange, ...rest }: InputProps) => (
  <TimeInput {...rest} value={entry.end} onChange={end => onChange({ end })} />
)
const TimeSeparator = () => <span className="mx-2 text-text-gentle">–⁠</span>

const ProjectOption = ({
  project,
  category,
}: {
  project: Project
  category: Partial<ProjectCategory>
}) => {
  const categoryPrefix = !category.id ? null : (
    <span className="hidden [[role='combobox']_&]:inline">
      <span className={colored({ type: "text", color: category.color })}>
        {category.name}
      </span>
      {" - "}
    </span>
  )

  return (
    <Select.Option key={project.id} label={project.name} value={project.id}>
      {categoryPrefix}
      {project.name}
    </Select.Option>
  )
}
const NoGroup = ({ children }: PropsWithChildren) => (
  <>
    {children}
    <Select.Separator />
  </>
)
const ProjectGroup = ({ projects, ...category }: CategoryWithProjects) => {
  if (projects.length === 0) return null
  const Group = !category.name ? NoGroup : Select.Group

  return (
    <Group
      key={category.id}
      label={category.name ?? ""}
      labelClassName={colored({ type: "text", color: category.color })}
    >
      {projects.map(project => (
        <ProjectOption key={project.id} project={project} category={category} />
      ))}
    </Group>
  )
}
const ProjectSelect = ({ entry, onChange, ...rest }: InputProps) => {
  const categories = useAtomValue(categoriesWithProjects)

  return (
    <Select.Root
      {...rest}
      placeholder="Project"
      value={entry.project ?? ""}
      onChange={project =>
        onChange({ project: project === "none" ? undefined : project })
      }
    >
      <Select.Option value="none" className="text-text-muted">
        No project
      </Select.Option>
      <Select.Separator />

      {categories.map(props => (
        <ProjectGroup key={props.id} {...props} />
      ))}

      <Link
        to="settings"
        className="m-2 h-8 text-sm text-text-gentle hover:text-text"
      >
        Go to project settings
      </Link>
    </Select.Root>
  )
}

export const inputs = {
  Description,
  Date: DateComp,
  TimeStart,
  TimeEnd,
  TimeSeparator,
  Project: ProjectSelect,
}
