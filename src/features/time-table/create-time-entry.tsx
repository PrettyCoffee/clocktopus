import {
  Dispatch,
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import { Plus } from "lucide-react"

import { Button } from "components/ui/button"
import { IconButton } from "components/ui/icon-button"
import { Portal } from "components/utility/portal"
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
import { colored, hstack, surface } from "utils/styles"
import { timeHelpers } from "utils/time-helpers"
import { today } from "utils/today"
import { zIndex } from "utils/z-index"

import { Duration } from "./duration"
import { inputs } from "./inputs"

const normalize = (text: string) => text.toLowerCase().replaceAll(/\s/g, "")

const useFilteredEntries = (filter: string) => {
  const dates = useTrackedDates()

  const allItems = useMemo(() => {
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

  return useMemo(
    () =>
      !filter
        ? []
        : allItems.filter(
            ({ description }) =>
              normalize(description) !== normalize(filter) &&
              normalize(description).includes(normalize(filter))
          ),
    [filter, allItems]
  )
}

const useProjects = () => {
  const projects = useAtomValue(projectsData)
  const categories = useAtomValue(projectCategories)

  return useMemo(
    () =>
      Object.fromEntries(
        projects.map(({ id, name, categoryId }) => {
          const category = !categoryId ? undefined : categories[categoryId]
          return [
            id,
            {
              name,
              categoryName: category?.name,
              categoryColor: category?.color,
            },
          ] as const
        })
      ),
    [projects, categories]
  )
}

interface AutoCompleteProps {
  filter: string
  onSelect: Dispatch<{ description: string; project?: string }>
}
const AutoComplete = ({
  filter,
  onSelect,
  children,
}: PropsWithChildren<AutoCompleteProps>) => {
  const [focus, setFocus] = useState(false)
  const [inputRect, setInputRect] =
    useState<ReturnType<Element["getBoundingClientRect"]>>()
  const entries = useFilteredEntries(filter).slice(0, 8)
  const projects = useProjects()

  const open = focus && !!filter && entries.length > 0

  const inputRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handler = () => {
      const input = inputRef.current
      const dropdown = dropdownRef.current
      const target = document.activeElement

      const focus =
        input === target ||
        input?.contains(target) ||
        dropdown === target ||
        dropdown?.contains(target)

      setFocus(!!focus)
    }

    window.addEventListener("focusin", handler)
    window.addEventListener("click", handler)

    return () => {
      window.removeEventListener("focusin", handler)
      window.removeEventListener("click", handler)
    }
  }, [])

  const updateBox = (element: Element | null) => {
    if (!element) return
    const box = element.getBoundingClientRect()
    if (
      inputRect &&
      box.left === inputRect.left &&
      box.bottom === inputRect.bottom &&
      box.width === inputRect.width
    ) {
      return
    }
    setInputRect(box)
  }

  return (
    <div
      className="relative w-full *:w-full"
      ref={element => {
        inputRef.current = element
        updateBox(element)
      }}
    >
      {children}
      {open && (
        <Portal>
          <div>
            <div
              ref={dropdownRef}
              className={cn(
                zIndex.popover,
                surface({ look: "overlay", size: "md" }),
                "fixed p-1"
              )}
              style={{
                position: "fixed",
                top: (inputRect?.bottom ?? 0) + 4,
                left: inputRect?.left,
                width: inputRect?.width,
              }}
            >
              {entries.map(item => {
                const project = !item.project
                  ? undefined
                  : projects[item.project]
                return (
                  <Button
                    key={item.description}
                    onClick={() => onSelect(item)}
                    className="w-full justify-between"
                  >
                    {item.description}
                    <span>
                      {project?.categoryName && (
                        <>
                          <span
                            className={colored({
                              type: "text",
                              color: project.categoryColor,
                            })}
                          >
                            {project.categoryName}
                          </span>
                          <span className="mx-2">-</span>
                        </>
                      )}
                      {project?.name || (
                        <span className="text-text-muted">No project</span>
                      )}
                    </span>
                  </Button>
                )
              })}
            </div>
          </div>
        </Portal>
      )}
    </div>
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
        <AutoComplete
          filter={data.description}
          onSelect={item => updateData(item)}
        >
          <inputs.Description
            entry={data}
            onChange={updateData}
            className="col-[1_/_-1] @4xl:col-[span_1]"
          />
        </AutoComplete>

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
