import { Trans } from "@lingui/react/macro"

import { categoryGroupsData, categoriesData } from "data/categories"
import { useAtom } from "lib/yaasl"
import { ClassNameProp } from "types/base-props"
import { cn } from "utils/cn"
import { colored } from "utils/styles"

export const CategoryName = ({
  categoryId,
  className,
}: ClassNameProp & { categoryId?: string }) => {
  const categories = useAtom(categoriesData)
  const groups = useAtom(categoryGroupsData)

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
    <span className={cn("text-text-muted", className)}>
      <Trans>No category</Trans>
    </span>
  ) : (
    <span className={className}>
      {groupName}
      {category.name}
    </span>
  )
}
