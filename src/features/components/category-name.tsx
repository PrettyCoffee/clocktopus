import { Trans } from "@lingui/react/macro"

import {
  categoryGroupsData,
  categoriesData,
  Category,
  CategoryGroup,
} from "data/categories"
import { useAtom } from "lib/yaasl"
import { ClassNameProp } from "types/base-props"
import { cn } from "utils/cn"
import { colored } from "utils/styles"

interface GetCategoryNameProps {
  categoryId?: string
  categories?: Category[]
  groups?: CategoryGroup[]
}
export const getCategoryName = ({
  categoryId,
  categories = categoriesData.get(),
  groups = categoryGroupsData.get(),
}: GetCategoryNameProps) => {
  const category = categories.find(({ id }) => id === categoryId)

  if (!category) return

  const group = groups.find(group => group.id === category.groupId)
  if (!group) return { name: category.name }

  return {
    name: category.name,
    group: {
      name: group.name,
      color: group.color,
    },
    fullName:
      [group.name, category.name].filter(Boolean).join(" - ") || undefined,
  }
}

export const CategoryName = ({
  categoryId,
  className,
}: ClassNameProp & { categoryId?: string }) => {
  const categories = useAtom(categoriesData)
  const groups = useAtom(categoryGroupsData)

  const category = getCategoryName({
    categoryId: categoryId ?? "",
    categories,
    groups,
  })

  const groupName = !category?.group ? null : (
    <span>
      <span className={colored({ type: "text", color: category.group.color })}>
        {category.group.name}
      </span>
      {" - "}
    </span>
  )

  return !category ? (
    <span className={cn("text-text-muted", className)}>
      <Trans>No category</Trans>
    </span>
  ) : (
    <span
      className={cn("inline-block max-w-48 truncate **:truncate", className)}
    >
      {groupName}
      {category.name}
    </span>
  )
}
