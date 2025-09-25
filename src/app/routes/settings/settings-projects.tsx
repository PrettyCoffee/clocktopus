import { Dispatch } from "react"

import { Plus, Trash } from "lucide-react"

import { Card } from "components/ui/card"
import { ColorInput } from "components/ui/color-input"
import { showDialog } from "components/ui/dialog"
import { IconButton } from "components/ui/icon-button"
import { Input } from "components/ui/input"
import { Select } from "components/ui/select"
import { createColumnHelper, Table } from "components/ui/table"
import { ScrollArea } from "components/utility/scroll-area"
import {
  Project,
  projectCategories,
  ProjectCategory,
  projectsData,
} from "data/projects"
import { useObjectState } from "hooks/use-object-state"
import { useAtomValue } from "lib/yaasl"
import { cn } from "utils/cn"
import { colored, hstack } from "utils/styles"

const requestDeletion = ({
  type,
  name,
  onDelete,
}: {
  type: "Project" | "Category"
  name: string
  onDelete: () => void
}) =>
  showDialog({
    title: `Delete ${type}`,
    description: `Do you really want to delete your "${name}" ${type}? This action cannot be reverted.`,
    confirm: {
      caption: "Confirm deletion",
      look: "destructive",
      onClick: onDelete,
    },
    cancel: {
      caption: "Cancel",
      look: "flat",
    },
  })

const AddCategory = () => {
  const initialData: Omit<ProjectCategory, "id"> = {
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
        placeholder="Category name"
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
        title="Add category"
        onClick={() => {
          projectCategories.actions.add(data)
          updateData(initialData)
        }}
      />
    </div>
  )
}

const categoryHelper = createColumnHelper<{ rowData: ProjectCategory }>()
const categoryNameColumn = categoryHelper.column({
  name: "Category name",
  className: "flex",
  render: ({ rowData }) => (
    <Input
      type="text"
      placeholder="Category name"
      value={rowData.name}
      onChange={name => projectCategories.actions.edit(rowData.id, { name })}
      className="flex-1"
    />
  ),
})
const categoryColorColumn = categoryHelper.column({
  name: "Category color",
  className: "*:w-full",
  render: ({ rowData }) => (
    <ColorInput
      mode="dropdown"
      value={rowData.color}
      onChange={color => projectCategories.actions.edit(rowData.id, { color })}
    />
  ),
})
const categoryDeleteColumn = categoryHelper.column({
  name: "Category actions",
  render: ({ rowData }) => (
    <IconButton
      icon={Trash}
      title="Delete category"
      className="[[role='row']:not(:hover,:focus-within)_&]:opacity-0"
      onClick={() =>
        requestDeletion({
          type: "Category",
          name: rowData.name,
          onDelete: () => projectCategories.actions.delete(rowData.id),
        })
      }
    />
  ),
})

const CategoryRows = () => {
  const categories = useAtomValue(projectCategories)
  return (
    <ScrollArea className="max-h-60">
      <Table
        columns={[
          categoryNameColumn,
          categoryColorColumn,
          categoryDeleteColumn,
        ]}
        gridCols="grid-cols-[1fr_auto_auto]"
        rowData={Object.values(categories)}
        rowMeta={{}}
      />
    </ScrollArea>
  )
}

const CategorySelect = ({
  value,
  onChange,
  categories,
}: {
  value: string
  onChange: Dispatch<string>
  categories: Record<string, ProjectCategory>
}) => (
  <Select.Root placeholder="None" value={value} onChange={onChange}>
    <Select.Option value="no" label="No category">
      <span className="text-text-muted">No category</span>
    </Select.Option>
    <Select.Separator />
    {Object.values(categories).map(category => (
      <Select.Option
        key={category.id}
        value={category.id}
        label={category.name}
      >
        <span className={colored({ type: "text", color: category.color })}>
          {category.name}
        </span>
      </Select.Option>
    ))}
  </Select.Root>
)

const AddProject = () => {
  const initialData: Omit<Project, "id"> = {
    name: "",
    categoryId: "",
  }
  const [data, updateData] = useObjectState(initialData)
  const categories = useAtomValue(projectCategories)

  return (
    <div
      className={cn(hstack({ gap: 2 }), "rounded-md bg-background-page/50 p-1")}
    >
      <Input
        type="text"
        placeholder="Project name"
        value={data.name}
        onChange={name => updateData({ name })}
        className="flex-1"
      />
      <CategorySelect
        value={data.categoryId ?? ""}
        onChange={categoryId => updateData({ categoryId })}
        categories={categories}
      />
      <IconButton
        icon={Plus}
        title="Add project"
        onClick={() => {
          projectsData.actions.add(data)
          updateData(initialData)
        }}
      />
    </div>
  )
}

const projectHelper = createColumnHelper<{
  rowData: Project
  rowMeta: { categories: Record<string, ProjectCategory> }
}>()
const projectNameColumn = projectHelper.column({
  name: "Project name",
  className: "flex",
  render: ({ rowData }) => (
    <Input
      type="text"
      placeholder="Project name"
      value={rowData.name}
      onChange={name => projectsData.actions.edit(rowData.id, { name })}
      className="flex-1"
    />
  ),
})
const projectCategoryColumn = projectHelper.column({
  name: "Project actions",
  className: "*:w-full",
  render: ({ rowData, categories }) => {
    const current = !rowData.categoryId
      ? undefined
      : categories[rowData.categoryId]
    return (
      <CategorySelect
        categories={categories}
        value={current?.id ?? ""}
        onChange={categoryId =>
          projectsData.actions.edit(rowData.id, { categoryId })
        }
      />
    )
  },
})
const projectDeleteColumn = projectHelper.column({
  name: "Project actions",
  render: ({ rowData }) => (
    <IconButton
      icon={Trash}
      title="Delete project"
      className="[[role='row']:not(:hover,:focus-within)_&]:opacity-0"
      onClick={() =>
        requestDeletion({
          type: "Project",
          name: rowData.name,
          onDelete: () => projectsData.actions.delete(rowData.id),
        })
      }
    />
  ),
})

const ProjectRows = () => {
  const projects = useAtomValue(projectsData)
  const categories = useAtomValue(projectCategories)
  return (
    <ScrollArea className="max-h-60">
      <Table
        columns={[
          projectNameColumn,
          projectCategoryColumn,
          projectDeleteColumn,
        ]}
        gridCols="grid-cols-[1fr_auto_auto]"
        rowData={projects}
        rowMeta={{ categories }}
      />
    </ScrollArea>
  )
}

export const SettingsProjects = () => (
  <>
    <Card
      title="Manage Projects"
      description={
        "Organize the projects that you are working on. " +
        "You can assign categories from below for better structure."
      }
    >
      <AddProject />
      <div className="pb-0.5" />
      <ProjectRows />
    </Card>
    <Card
      title="Manage Project Categories"
      description={
        "Manage the projects categories that you can use to cluster your projects. " +
        'For example, you could group the Projects "Feature Development" and "Code Maintenance" in a "Development" category. '
      }
    >
      <AddCategory />
      <div className="pb-0.5" />
      <CategoryRows />
    </Card>
  </>
)
