import { createSelector } from "lib/yaasl"

import { Category, categoriesData } from "./categories-data"
import { categoryGroupsData, CategoryGroup } from "./category-groups-data"

export interface GroupedCategories extends Partial<CategoryGroup> {
  categories: Category[]
}

export const groupedCategories = createSelector(
  [categoryGroupsData, categoriesData],
  (groups, allCategories) =>
    groups.map<GroupedCategories>(group => {
      const categories = allCategories.filter(
        category => category.groupId === group.id
      )
      return { ...group, categories: categories }
    })
)
