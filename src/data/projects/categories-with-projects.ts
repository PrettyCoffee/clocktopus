import { createSelector } from "lib/yaasl"

import { projectCategories, ProjectCategory } from "./project-categories"
import { Project, projectsData } from "./projects-data"

const getCategoryOrder = (projects: Project[]) => {
  const categoryOrder: (string | undefined)[] = []
  projects.forEach(({ categoryId }) => {
    if (categoryOrder.includes(categoryId)) return
    categoryOrder.push(categoryId)
  })
  return categoryOrder.sort(a => (!a ? 1 : -1))
}

export interface CategoryWithProjects extends Partial<ProjectCategory> {
  projects: Project[]
}

export const categoriesWithProjects = createSelector(
  [projectCategories, projectsData],
  (categories, allProjects) => {
    const categoryOrder = getCategoryOrder(allProjects)

    return categoryOrder.map<CategoryWithProjects>(id => {
      const projects = allProjects.filter(project => project.categoryId === id)
      const category = categories.find(category => category.id === id)
      return { ...category, projects }
    })
  }
)
