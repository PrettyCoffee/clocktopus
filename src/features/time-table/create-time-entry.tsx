import { Dispatch, PropsWithChildren, useMemo } from "react"

import { Plus } from "lucide-react"

import { AutoComplete } from "components/ui/auto-complete"
import { IconButton } from "components/ui/icon-button"
import { projectCategories, projectsData } from "data/projects"
import {
  getDateAtom,
  useDateEntries,
  useTrackedDates,
  type TimeEntry,
} from "data/time-entries"
import { useObjectState } from "hooks/use-object-state"
import { useAtomValue } from "lib/yaasl"
import { cn } from "utils/cn"
import { hstack } from "utils/styles"
import { timeHelpers } from "utils/time-helpers"
import { today } from "utils/today"

import { Duration } from "./duration"
import { inputs } from "./inputs"
import { ProjectName } from "./project-name"

const useAllTimeEntries = () => {
  const dates = useTrackedDates()

  return useMemo(() => {
    const allItems = dates
      .flatMap(date =>
        getDateAtom(date)
          .get()
          .filter(({ description }) => !!description)
      )
      .map(({ description, project }) => ({ description, project }))

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
  }, [dates])
}

const useProjects = () => {
  const projects = useAtomValue(projectsData)
  const categories = useAtomValue(projectCategories)

  return useMemo(
    () =>
      Object.fromEntries(
        projects.map(({ categoryId, ...project }) => {
          const category = !categoryId ? undefined : categories[categoryId]
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
    {description}
    {project && <ProjectName projectId={project.id} />}
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
  const entries = useAllTimeEntries()
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
          project={!item.project ? undefined : projects[item.project]}
        />
      )}
    >
      {children}
    </AutoComplete>
  )
}

const getInitialState = (date?: string, start?: string): TimeEntry => ({
  id: 0,
  description: "",
  start: start ?? timeHelpers.now({ snap: 15 }),
  end: timeHelpers.now({ snap: 15 }),
  date: date || today(),
})

export const CreateTimeEntry = () => {
  const [data, updateData] = useObjectState(getInitialState())
  const { atom } = useDateEntries(data.date)

  return (
    <div className="@container w-full flex-1">
      <div
        className={cn(
          "grid items-center gap-2",
          "grid-cols-[1fr_auto_auto_auto_auto] @4xl:grid-cols-[1fr_auto_auto_auto_auto_auto]"
        )}
      >
        <DescriptionAutoComplete
          filter={data.description}
          onSelect={item => updateData(item)}
        >
          <inputs.Description
            entry={data}
            onChange={updateData}
            className="col-[1_/_-1] @4xl:col-[span_1]"
          />
        </DescriptionAutoComplete>

        <div>
          <inputs.Project entry={data} onChange={updateData} />
        </div>

        <inputs.Date entry={data} onChange={updateData} />
        <div className={hstack({ align: "center" })}>
          <inputs.TimeStart entry={data} onChange={updateData} />
          <inputs.TimeSeparator />
          <inputs.TimeEnd entry={data} onChange={updateData} />
        </div>
        <Duration entries={[data]} className="inline-block w-15 text-center" />
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
  )
}
