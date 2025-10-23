import { Dispatch, PropsWithChildren } from "react"

import { Link } from "wouter"

import { Select } from "components/ui/select"
import {
  categoriesWithProjects,
  CategoryWithProjects,
  Project,
} from "data/projects"
import { useAtomValue } from "lib/yaasl"
import { ClassNameProp } from "types/base-props"
import { colored } from "utils/styles"

import { ProjectName } from "./project-name"

const ProjectOption = ({ project }: { project: Project }) => (
  <Select.Option key={project.id} label={project.name} value={project.id}>
    <ProjectName
      projectId={project.id}
      className="*:hidden [[role='combobox']_&_*]:inline"
    />
  </Select.Option>
)

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
        <ProjectOption key={project.id} project={project} />
      ))}
    </Group>
  )
}

interface ProjectSelectProps extends ClassNameProp {
  caption?: string
  value: string
  onChange: Dispatch<string>
}
export const ProjectSelect = ({
  value,
  onChange,
  ...rest
}: ProjectSelectProps) => {
  const categories = useAtomValue(categoriesWithProjects)

  const exists = categories.some(item =>
    item.projects.some(({ id }) => id === value)
  )

  return (
    <Select.Root
      placeholder="Project"
      value={exists ? value : "none"}
      onChange={project => onChange(project === "none" ? "" : project)}
      {...rest}
    >
      <Select.Option value="none">
        <span className="text-text-muted">No project</span>
      </Select.Option>
      <Select.Separator />

      {categories.map(props => (
        <ProjectGroup key={props.id} {...props} />
      ))}

      <Link
        to="/settings/projects"
        className="m-2 h-8 text-sm text-text-gentle hover:text-text"
      >
        Go to project settings
      </Link>
    </Select.Root>
  )
}
