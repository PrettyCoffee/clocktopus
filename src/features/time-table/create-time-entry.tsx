import { Dispatch, PropsWithChildren, useMemo } from "react"

import { Plus } from "lucide-react"

import { AutoComplete } from "components/ui/auto-complete"
import { IconButton } from "components/ui/icon-button"
import { projectCategories, projectsData } from "data/projects"
import {
  useDateEntries,
  useAllTimeEntries,
  type TimeEntry,
} from "data/time-entries"
import { ProjectName } from "features/components/project-name"
import { useObjectState } from "hooks/use-object-state"
import { useAtomValue } from "lib/yaasl"
import { cn } from "utils/cn"
import { createId } from "utils/create-id"
import { dateHelpers } from "utils/date-helpers"
import { hstack } from "utils/styles"
import { timeHelpers } from "utils/time-helpers"

import { Duration } from "./duration"
import { inputs } from "./inputs"

const useSearchableTimeEntries = () => {
  const allEntries = useAllTimeEntries()

  return useMemo(() => {
    const allItems = allEntries
      .filter(({ description }) => !!description)
      .map(({ description, projectId }) => ({ description, projectId }))

    const withoutDuplicates = allItems.reduce(
      (result, item) => {
        if (result.check.has(item.description)) return result
        result.check.add(item.description)
        result.items.push(item)
        return result
      },
      { check: new Set<string>(), items: [] as typeof allItems }
    )

    return withoutDuplicates.items
  }, [allEntries])
}

const useProjects = () => {
  const projects = useAtomValue(projectsData)
  const categories = useAtomValue(projectCategories)

  return useMemo(
    () =>
      Object.fromEntries(
        projects.map(({ categoryId, ...project }) => {
          const category = categories.find(
            category => category.id === categoryId
          )
          return [
            project.id,
            {
              ...project,
              categoryName: category?.name,
              categoryColor: category?.color,
            },
          ] as const
        })
      ),
    [projects, categories]
  )
}

interface LabelProps {
  description: string
  project?: ReturnType<typeof useProjects>[number]
}
const OptionLabel = ({ description, project }: LabelProps) => (
  <>
    <div className="flex-1 truncate">{description}</div>
    <ProjectName projectId={project?.id} />
  </>
)

interface DescriptionAutoCompleteProps {
  filter: string
  onSelect: Dispatch<{ description: string; project?: string }>
}
const DescriptionAutoComplete = ({
  filter,
  onSelect,
  children,
}: PropsWithChildren<DescriptionAutoCompleteProps>) => {
  const entries = useSearchableTimeEntries()
  const projects = useProjects()

  return (
    <AutoComplete<(typeof entries)[number]>
      filter={filter}
      getFilterValue={({ description }) => description}
      items={entries}
      onSelect={onSelect}
      renderOptionLabel={item => (
        <OptionLabel
          description={item.description}
          project={!item.projectId ? undefined : projects[item.projectId]}
        />
      )}
    >
      {children}
    </AutoComplete>
  )
}

const getInitialState = (date?: string, start?: string): TimeEntry => ({
  id: createId("mini"),
  description: "",
  start: start ?? timeHelpers.now({ snap: 15 }),
  end: timeHelpers.now({ snap: 15 }),
  date: date || dateHelpers.today(),
})

export const CreateTimeEntry = () => {
  const [data, updateData] = useObjectState(getInitialState())
  const { atom } = useDateEntries(data.date)

  return (
    <div className="@container w-full flex-1">
      <div
        className={cn(
          "grid items-center gap-2",
          "grid-cols-[auto_auto_1fr_2.5rem] @xl:grid-cols-[1fr_auto_auto_auto_2.5rem] @4xl:grid-cols-[1fr_auto_auto_auto_auto_2.5rem]"
        )}
      >
        <DescriptionAutoComplete
          filter={data.description}
          onSelect={item => updateData(item)}
        >
          <inputs.Description
            entry={data}
            onChange={updateData}
            className="col-span-full @4xl:col-[span_1]"
          />
        </DescriptionAutoComplete>

        <div className="col-[span_2] @xl:col-auto">
          <inputs.Project entry={data} onChange={updateData} />
        </div>

        <div className="col-[span_2] justify-self-end @xl:col-auto @xl:justify-self-start">
          <inputs.Date entry={data} onChange={updateData} />
        </div>
        <div className={hstack({ align: "center" })}>
          <inputs.TimeStart entry={data} onChange={updateData} />
          <inputs.TimeSeparator />
          <inputs.TimeEnd entry={data} onChange={updateData} />
        </div>
        <Duration entries={[data]} className="inline-block w-15 text-center" />
        <div className="col-4 @xl:col-auto">
          <IconButton
            icon={Plus}
            title="Add item"
            hideTitle
            onClick={() => {
              atom.actions.add(data)
              updateData(getInitialState(data.date, data.end))
            }}
          />
        </div>
      </div>
    </div>
  )
}
