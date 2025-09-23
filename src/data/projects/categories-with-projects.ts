import { createSelector } from "lib/yaasl"

import { projectCategories, ProjectCategory } from "./project-categories"
import { Project, projectsData } from "./projects-data"

const getCategoryOrder = (projects: Project[]) => {
  const categoryOrder: string[] = []
  projects.forEach(({ categoryId }) => {
    if (categoryOrder.includes(categoryId)) return
    categoryOrder.push(categoryId)
  })
  return categoryOrder
}

export interface CategoryWithProjects extends ProjectCategory {
  projects: Omit<Project, "categoryId">[]
}

export const categoriesWithProjects = createSelector(
  [projectCategories, projectsData],
  (categories, allProjects) => {
    const categoryOrder = getCategoryOrder(allProjects)

    return categoryOrder.map<CategoryWithProjects>(id => {
      const projects = allProjects
        .filter(project => project.categoryId === id)
        // eslint-disable-next-line unused-imports/no-unused-vars
        .map(({ categoryId, ...project }) => project)

      return { ...categories[id]!, projects }
    })
  }
)
