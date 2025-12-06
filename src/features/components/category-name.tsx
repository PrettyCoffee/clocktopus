import { categoryGroupsData, categoriesData } from "data/categories"
import { useAtomValue } from "lib/yaasl"
import { ClassNameProp } from "types/base-props"
import { cn } from "utils/cn"
import { colored } from "utils/styles"

export const CategoryName = ({
  categoryId,
  className,
}: ClassNameProp & { categoryId?: string }) => {
  const categories = useAtomValue(categoriesData)
  const groups = useAtomValue(categoryGroupsData)

  const category = categories.find(({ id }) => id === categoryId)
  const group = groups.find(group => group.id === category?.groupId)

  const groupName = !group ? null : (
    <span>
      <span className={colored({ type: "text", color: group.color })}>
        {group.name}
      </span>
      {" - "}
    </span>
  )

  return !category ? (
    <span className={cn("text-text-muted", className)}>No Category</span>
  ) : (
    <span className={className}>
      {groupName}
      {category.name}
    </span>
  )
}
