import { Dispatch, PropsWithChildren, useMemo } from "react"

import { t } from "@lingui/core/macro"
import { Plus } from "lucide-react"

import { AutoComplete } from "components/ui/auto-complete"
import { IconButton } from "components/ui/icon-button"
import { categoryGroupsData, categoriesData } from "data/categories"
import {
  useDateEntries,
  useAllTimeEntries,
  type TimeEntry,
} from "data/time-entries"
import { CategoryName } from "features/components/category-name"
import { useObjectState } from "hooks/use-object-state"
import { useAtom } from "lib/yaasl"
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
      .toSorted((a, b) => b.date.localeCompare(a.date))
      .map(({ description, categoryId }) => ({ description, categoryId }))

    const withoutDuplicates = allItems.reduce(
      (result, item) => {
        const checksum = `${item.description}__${item.categoryId}`
        if (result.check.has(checksum)) return result
        result.check.add(checksum)
        result.items.push(item)
        return result
      },
      { check: new Set<string>(), items: [] as typeof allItems }
    )

    return withoutDuplicates.items
  }, [allEntries])
}

const useCategory = () => {
  const categories = useAtom(categoriesData)
  const groups = useAtom(categoryGroupsData)

  return useMemo(
    () =>
      Object.fromEntries(
        categories.map(({ groupId, ...category }) => {
          const group = groups.find(group => group.id === groupId)
          return [
            category.id,
            {
              ...category,
              groupName: group?.name,
              groupColor: group?.color,
            },
          ] as const
        })
      ),
    [categories, groups]
  )
}

interface LabelProps {
  description: string
  category?: ReturnType<typeof useCategory>[number]
}
const OptionLabel = ({ description, category }: LabelProps) => (
  <>
    <div className="flex-1 truncate">{description}</div>
    <CategoryName categoryId={category?.id} />
  </>
)

interface DescriptionAutoCompleteProps {
  filter: string
  onSelect: Dispatch<{ description: string; categoryId?: string }>
}
const DescriptionAutoComplete = ({
  filter,
  onSelect,
  children,
}: PropsWithChildren<DescriptionAutoCompleteProps>) => {
  const entries = useSearchableTimeEntries()
  const categories = useCategory()

  return (
    <AutoComplete<(typeof entries)[number]>
      getId={({ description, categoryId }) => `${description}__${categoryId}`}
      filter={filter}
      getFilterValue={({ description }) => description}
      items={entries}
      onSelect={({ description, categoryId }) =>
        onSelect({ description, categoryId })
      }
      renderOptionLabel={item => (
        <OptionLabel
          description={item.description}
          category={!item.categoryId ? undefined : categories[item.categoryId]}
        />
      )}
    >
      {children}
    </AutoComplete>
  )
}

const getInitialState = (
  date = dateHelpers.today(),
  start = timeHelpers.now({ snap: 15 })
): TimeEntry => ({
  id: createId("mini"),
  description: "",
  start,
  end: date === dateHelpers.today() ? timeHelpers.now({ snap: 15 }) : start,
  date,
})

interface CreateTimeEntryProps {
  initialDate?: string
  initialTime?: string
  onCreate?: Dispatch<TimeEntry>
}
export const CreateTimeEntry = ({
  onCreate,
  initialDate,
  initialTime,
}: CreateTimeEntryProps) => {
  const [data, updateData] = useObjectState(
    getInitialState(initialDate, initialTime)
  )
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
          <inputs.Category entry={data} onChange={updateData} />
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
            title={t`Add entry`}
            hideTitle
            onClick={() => {
              atom.actions.add(data)
              updateData(getInitialState(data.date, data.end))
              onCreate?.(data)
            }}
          />
        </div>
      </div>
    </div>
  )
}
