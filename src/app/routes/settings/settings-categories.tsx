import { Dispatch } from "react"

import { msg, t } from "@lingui/core/macro"
import { Trans } from "@lingui/react/macro"
import { ChevronDown, ChevronUp, Plus, Trash } from "lucide-react"

import { Card } from "components/ui/card"
import { ColorInput } from "components/ui/color-input"
import { showDialog } from "components/ui/dialog"
import { Icon } from "components/ui/icon"
import { IconButton } from "components/ui/icon-button"
import { Input } from "components/ui/input"
import { Select } from "components/ui/select"
import { createColumnHelper, Table } from "components/ui/table"
import { Toggle } from "components/ui/toggle"
import { ScrollArea } from "components/utility/scroll-area"
import { VisuallyHidden } from "components/utility/visually-hidden"
import {
  Category,
  categoryGroupsData,
  CategoryGroup,
  categoriesData,
} from "data/categories"
import { useObjectState } from "hooks/use-object-state"
import { useAtom } from "lib/yaasl"
import { cn } from "utils/cn"
import { colored, hstack, interactive, vstack } from "utils/styles"

const requestDeletion = ({
  type,
  name,
  onDelete,
}: {
  type: "category" | "group"
  name: string
  onDelete: () => void
}) => {
  const typeName = {
    category: t`category`,
    group: t`group`,
  }[type]

  showDialog({
    title: t`Delete ${type}`,
    description: t`Do you really want to delete your "${name}" ${typeName}? This action cannot be reverted.`,
    confirm: {
      caption: t`Confirm deletion`,
      look: "destructive",
      onClick: onDelete,
    },
    cancel: {},
  })
}

const AddGroup = () => {
  const initialData: Omit<CategoryGroup, "id"> = {
    name: "",
    color: "neutral",
  }
  const [data, updateData] = useObjectState(initialData)

  return (
    <div
      className={cn(hstack({ gap: 2 }), "rounded-md bg-background-page/50 p-1")}
    >
      <Input
        type="text"
        placeholder={t`Group name`}
        value={data.name}
        onChange={name => updateData({ name })}
        className="flex-1"
      />
      <ColorInput
        mode="dropdown"
        value={data.color}
        onChange={color => updateData({ color })}
      />
      <IconButton
        icon={Plus}
        title={t`Add group`}
        onClick={() => {
          categoryGroupsData.actions.add(data)
          updateData(initialData)
        }}
      />
    </div>
  )
}

interface MoveButtonProps {
  direction: "up" | "down"
  onClick: () => void
  disabled: boolean
}
const MoveButton = ({ direction, disabled, ...props }: MoveButtonProps) => {
  const isUp = direction === "up"
  const icon = isUp ? ChevronUp : ChevronDown
  const caption = isUp ? t`Move up` : t`Move down`

  return (
    <button
      {...props}
      disabled={disabled}
      className={cn(
        interactive({ look: "flat", disabled }),
        hstack({ align: isUp ? "end" : "start", justify: "center" }),
        "m-0 w-full flex-1 overflow-hidden"
      )}
    >
      <Icon size="sm" icon={icon} />
      <VisuallyHidden>{caption}</VisuallyHidden>
    </button>
  )
}

interface MoveButtonsProps {
  canMoveUp: boolean
  canMoveDown: boolean
  onClick: Dispatch<number>
}
const MoveButtons = ({ canMoveDown, canMoveUp, onClick }: MoveButtonsProps) => (
  <div
    className={cn(
      vstack({ gap: 0, inline: true }),
      "size-10 overflow-hidden rounded-md [[role='row']:not(:hover,:has(*:focus-visible))_&]:opacity-50"
    )}
  >
    <MoveButton
      direction="up"
      disabled={!canMoveUp}
      onClick={() => onClick(-1)}
    />
    <MoveButton
      direction="down"
      disabled={!canMoveDown}
      onClick={() => onClick(1)}
    />
  </div>
)

const groupHelper = createColumnHelper<{ rowData: CategoryGroup }>()
const groupOrderColumn = groupHelper.column({
  name: msg`Group order`,
  render: ({ rowData, allData, rowIndex }) => (
    <MoveButtons
      onClick={change => categoryGroupsData.actions.move(rowData.id, change)}
      canMoveUp={rowIndex > 0}
      canMoveDown={rowIndex < allData.length - 1}
    />
  ),
})
const groupNameColumn = groupHelper.column({
  name: msg`Group name`,
  className: "flex",
  render: ({ rowData }) => (
    <Input
      type="text"
      placeholder={t`Group name`}
      value={rowData.name}
      onChange={name => categoryGroupsData.actions.edit(rowData.id, { name })}
      className="flex-1"
    />
  ),
})
const groupColorColumn = groupHelper.column({
  name: msg`Group color`,
  className: "*:w-full",
  render: ({ rowData }) => (
    <ColorInput
      mode="dropdown"
      value={rowData.color}
      onChange={color => categoryGroupsData.actions.edit(rowData.id, { color })}
    />
  ),
})
const groupDeleteColumn = groupHelper.column({
  name: msg`Group actions`,
  render: ({ rowData }) => (
    <IconButton
      icon={Trash}
      title={t`Delete group`}
      className="[[role='row']:not(:hover,:focus-within)_&]:opacity-0"
      onClick={() =>
        requestDeletion({
          type: "group",
          name: rowData.name,
          onDelete: () => categoryGroupsData.actions.delete(rowData.id),
        })
      }
    />
  ),
})

const GroupRows = () => {
  const groups = useAtom(categoryGroupsData)
  return (
    <ScrollArea className="max-h-60">
      <Table
        hideHeaders
        columns={[
          groupOrderColumn,
          groupNameColumn,
          groupColorColumn,
          groupDeleteColumn,
        ]}
        gridCols="grid-cols-[auto_1fr_auto_auto]"
        rowData={groups}
        rowMeta={{}}
      />
    </ScrollArea>
  )
}

const GroupSelect = ({
  value,
  onChange,
  groups,
}: {
  value: string
  onChange: Dispatch<string>
  groups: CategoryGroup[]
}) => (
  <Select.Root placeholder={t`No group`} value={value} onChange={onChange}>
    <Select.Option value="none" label={t`No group`}>
      <span className="text-text-muted">
        <Trans>No group</Trans>
      </span>
    </Select.Option>
    <Select.Separator />
    {groups.map(group => (
      <Select.Option key={group.id} value={group.id} label={group.name}>
        <span className={colored({ type: "text", color: group.color })}>
          {group.name}
        </span>
      </Select.Option>
    ))}
  </Select.Root>
)

const AddCategory = () => {
  const initialData: Omit<Category, "id"> = {
    name: "",
    groupId: "",
  }
  const [data, updateData] = useObjectState(initialData)
  const groups = useAtom(categoryGroupsData)

  return (
    <div
      className={cn(hstack({ gap: 2 }), "rounded-md bg-background-page/50 p-1")}
    >
      <Input
        type="text"
        placeholder={t`Category name`}
        value={data.name}
        onChange={name => updateData({ name })}
        className="flex-1"
      />
      <GroupSelect
        value={data.groupId ?? ""}
        onChange={groupId => updateData({ groupId })}
        groups={groups}
      />
      <IconButton
        icon={Plus}
        title={t`Add category`}
        onClick={() => {
          categoriesData.actions.add(data)
          updateData(initialData)
        }}
      />
    </div>
  )
}

const categoryHelper = createColumnHelper<{
  rowData: Category
  rowMeta: { groups: CategoryGroup[] }
}>()
const categoryOrderColumn = categoryHelper.column({
  name: msg`Category order`,
  render: ({ rowData, allData, rowIndex }) => (
    <MoveButtons
      onClick={change => categoriesData.actions.move(rowData.id, change)}
      canMoveUp={rowIndex > 0}
      canMoveDown={rowIndex < allData.length - 1}
    />
  ),
})
const categoryNameColumn = categoryHelper.column({
  name: msg`Category name`,
  className: "flex",
  render: ({ rowData }) => (
    <Input
      type="text"
      placeholder={t`Category name`}
      value={rowData.name}
      onChange={name => categoriesData.actions.edit(rowData.id, { name })}
      className="flex-1"
    />
  ),
})
const categoryPrivateColumn = categoryHelper.column({
  name: msg`Category is private`,
  className: "flex",
  render: ({ rowData }) => (
    <Toggle
      label={t`Private`}
      checked={!!rowData.isPrivate}
      onChange={isPrivate =>
        categoriesData.actions.edit(rowData.id, { isPrivate })
      }
    />
  ),
})
const categoryGroupColumn = categoryHelper.column({
  name: msg`Category actions`,
  className: "*:w-full",
  render: ({ rowData, groups }) => {
    const current = groups.find(group => group.id === rowData.groupId)
    return (
      <GroupSelect
        groups={groups}
        value={current?.id ?? ""}
        onChange={groupId =>
          categoriesData.actions.edit(rowData.id, { groupId })
        }
      />
    )
  },
})
const categoryDeleteColumn = categoryHelper.column({
  name: msg`Category actions`,
  render: ({ rowData }) => (
    <IconButton
      icon={Trash}
      title={t`Delete category`}
      className="[[role='row']:not(:hover,:focus-within)_&]:opacity-0"
      onClick={() =>
        requestDeletion({
          type: "category",
          name: rowData.name,
          onDelete: () => categoriesData.actions.delete(rowData.id),
        })
      }
    />
  ),
})

const CategoryRows = () => {
  const categories = useAtom(categoriesData)
  const groups = useAtom(categoryGroupsData)
  return (
    <ScrollArea className="max-h-60">
      <Table
        hideHeaders
        columns={[
          categoryOrderColumn,
          categoryNameColumn,
          categoryGroupColumn,
          categoryPrivateColumn,
          categoryDeleteColumn,
        ]}
        gridCols="grid-cols-[auto_1fr_auto_auto_auto]"
        rowData={categories}
        rowMeta={{ groups }}
      />
    </ScrollArea>
  )
}

export const SettingsCategories = () => (
  <>
    <Card
      title={t`Manage Category Groups`}
      description={
        <Trans>
          Manage groups that you can use to cluster your categories. For
          example, you could group the categories "Feature Development" and
          "Code Maintenance" in a "Development" group.
        </Trans>
      }
    >
      <AddGroup />
      <div className="pb-0.5" />
      <GroupRows />
    </Card>

    <Card
      title={t`Manage Categories`}
      description={
        <Trans>
          Organize categories to label your time entries. You can mark a
          category as private to remove it from statistics.
        </Trans>
      }
    >
      <AddCategory />
      <div className="pb-0.5" />
      <CategoryRows />
    </Card>
  </>
)
