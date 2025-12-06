import { createSelector } from "lib/yaasl"

import { Category, categoriesData } from "./categories-data"
import { categoryGroupsData, CategoryGroup } from "./category-groups-data"

const getGroupOrder = (categories: Category[]) => {
  const groupOrder: (string | undefined)[] = []
  categories.forEach(({ groupId }) => {
    if (groupOrder.includes(groupId)) return
    groupOrder.push(groupId)
  })
  return groupOrder.sort(a => (!a ? 1 : -1))
}

export interface GroupedCategories extends Partial<CategoryGroup> {
  categories: Category[]
}

export const groupedCategories = createSelector(
  [categoryGroupsData, categoriesData],
  (groups, allCategories) => {
    const groupOrder = getGroupOrder(allCategories)

    return groupOrder.map<GroupedCategories>(id => {
      const categories = allCategories.filter(
        category => category.groupId === id
      )
      const group = groups.find(group => group.id === id)
      return { ...group, categories: categories }
    })
  }
)
