import { projectCategories, projectsData } from "data/projects"
import { useAtomValue } from "lib/yaasl"
import { ClassNameProp } from "types/base-props"
import { cn } from "utils/cn"
import { colored } from "utils/styles"

export const ProjectName = ({
  projectId,
  className,
}: ClassNameProp & { projectId?: string }) => {
  const projects = useAtomValue(projectsData)
  const categories = useAtomValue(projectCategories)

  const project = projects.find(({ id }) => id === projectId)
  const category = !project?.categoryId
    ? undefined
    : categories[project.categoryId]

  const categoryName = !category ? null : (
    <span>
      <span className={colored({ type: "text", color: category.color })}>
        {category.name}
      </span>
      {" - "}
    </span>
  )

  return !project ? (
    <span className={cn("text-text-muted", className)}>No Project</span>
  ) : (
    <span className={className}>
      {categoryName}
      {project.name}
    </span>
  )
}
