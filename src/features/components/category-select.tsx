import { Dispatch, PropsWithChildren } from "react"

import { t } from "@lingui/core/macro"
import { Trans } from "@lingui/react/macro"
import { Link } from "wouter"

import { Select } from "components/ui/select"
import { groupedCategories, GroupedCategories, Category } from "data/categories"
import { useAtom } from "lib/yaasl"
import { ClassNameProp } from "types/base-props"
import { colored } from "utils/styles"

import { CategoryName } from "./category-name"

const CategoryOption = ({ category }: { category: Category }) => (
  <Select.Option key={category.id} label={category.name} value={category.id}>
    <CategoryName
      categoryId={category.id}
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

const CategoryGroup = ({
  categories: categories,
  ...group
}: GroupedCategories) => {
  if (categories.length === 0) return null
  const Group = !group.name ? NoGroup : Select.Group

  return (
    <Group
      key={group.id}
      label={group.name ?? ""}
      labelClassName={colored({ type: "text", color: group.color })}
    >
      {categories.map(category => (
        <CategoryOption key={category.id} category={category} />
      ))}
    </Group>
  )
}

interface CategorySelectProps extends ClassNameProp {
  caption?: string
  value: string
  onChange: Dispatch<string>
}
export const CategorySelect = ({
  value,
  onChange,
  ...rest
}: CategorySelectProps) => {
  const groups = useAtom(groupedCategories)

  const exists = groups.some(item =>
    item.categories.some(({ id }) => id === value)
  )

  return (
    <Select.Root
      placeholder={t`Category`}
      value={exists ? value : "none"}
      onChange={category => onChange(category === "none" ? "" : category)}
      {...rest}
    >
      <Select.Option value="none">
        <span className="text-text-muted">
          <Trans>No category</Trans>
        </span>
      </Select.Option>
      <Select.Separator />

      {groups.map(props => (
        <CategoryGroup key={props.id} {...props} />
      ))}

      <Link
        to="/settings/categories"
        className="m-2 h-8 text-sm text-text-gentle hover:text-text"
      >
        <Trans>Go to category settings</Trans>
      </Link>
    </Select.Root>
  )
}
