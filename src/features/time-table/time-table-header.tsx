import { Dispatch, SetStateAction, useState } from "react"

import { Lock, Unlock } from "lucide-react"

import { Checkbox } from "components/ui/checkbox"
import { IconButton } from "components/ui/icon-button"
import { Tooltip } from "components/ui/tooltip"
import { editableDatesData } from "data/editable-dates"
import { projectsData } from "data/projects"
import { type TimeEntry } from "data/time-entries"
import { ProjectName } from "features/components/project-name"
import { useIntersectionObserver } from "hooks/use-intersection-observer"
import { useAtomValue } from "lib/yaasl"
import { cn } from "utils/cn"
import { getLocale } from "utils/get-locale"
import { hstack, vstack } from "utils/styles"
import { timeHelpers } from "utils/time-helpers"

import { CheckedState } from "./bulk-actions"
import { Duration } from "./duration"

const formatDate = (date: string) => {
  const locale = getLocale()
  if (locale === "iso") {
    const weekday = new Date(date).toLocaleDateString("en", {
      weekday: "short",
    })
    return `${weekday}, ${date}`
  }
  return new Date(date).toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    weekday: "short",
  })
}

const DateDurations = ({ entries }: { entries: TimeEntry[] }) => {
  const projects = useAtomValue(projectsData)

  const totalTimeByProject = [{ id: undefined }, ...projects]
    .map(project => {
      const items = entries.filter(entry => entry.projectId === project.id)
      const minutes = items.reduce(
        (result, { start, end }) => result + timeHelpers.getDiff(start, end),
        0
      )
      return {
        projectId: project.id,
        minutes,
        duration: timeHelpers.fromMinutes(minutes),
      }
    })
    .filter(({ minutes }) => minutes > 0)
    .sort((a, b) => b.minutes - a.minutes)

  const total = totalTimeByProject.reduce(
    (result, { minutes }) => result + minutes,
    0
  )
  const totalDuration = (
    <span className="px-4 text-base">
      <span className="text-text-gentle">Total: </span>
      <Duration minutes={total} />
    </span>
  )

  return total === 0 ? (
    totalDuration
  ) : (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <button className="rounded-md">{totalDuration}</button>
      </Tooltip.Trigger>
      <Tooltip.Content align="end" side="bottom" asChild>
        <div className={cn(vstack({ justify: "end" }), "text-sm")}>
          {totalTimeByProject.map(({ duration, projectId }) => (
            <span
              key={projectId}
              className={hstack({ justify: "between", gap: 2 })}
            >
              <ProjectName projectId={projectId} />
              <span className="font-mono">{duration}</span>
            </span>
          ))}
        </div>
      </Tooltip.Content>
    </Tooltip.Root>
  )
}

interface TimeTableHeaderProps {
  date: string
  entries: TimeEntry[]
  isEditable: boolean
  checked: CheckedState[string]
  setChecked: Dispatch<SetStateAction<CheckedState>>
}
export const TimeTableHeader = ({
  date,
  entries,
  isEditable,
  checked,
  setChecked,
}: TimeTableHeaderProps) => {
  const [topOffset, setTopOffset] = useState("0px")
  const { ref, isIntersecting } = useIntersectionObserver({
    rootMargin: `-${topOffset} 0px 0px 0px`, // trigger offset to the top of the scroll area (window)
  })

  const checkedState = entries.every(({ id }) => checked[id])
    ? true
    : Object.keys(checked).length > 0
      ? "indeterminate"
      : false

  const handleCheckedChange = (checked: boolean) => {
    const newChecked = !checked
      ? {}
      : entries.reduce<Record<string, true>>((all, { id }) => {
          all[id] = true
          return all
        }, {})

    setChecked(state => {
      const newState = { ...state }
      if (Object.keys(newChecked).length === 0) {
        delete newState[date]
      } else {
        newState[date] = newChecked
      }
      return newState
    })
  }

  return (
    <>
      <div ref={ref} />
      <div
        ref={element => {
          if (!element) return
          const styles = getComputedStyle(element)
          setTopOffset(styles.top)
        }}
        className={cn(
          hstack({ align: "center" }),
          "h-12 rounded-t-lg border-b border-stroke-gentle bg-background-page",
          "sticky top-18 z-20",
          !isIntersecting && "rounded-lg"
        )}
      >
        {isEditable && (
          <Checkbox
            checked={checkedState}
            onCheckedChange={handleCheckedChange}
            className="ml-1"
          />
        )}
        <h2 className="mr-2 ml-3 text-base">{formatDate(date)}</h2>
        <IconButton
          icon={isEditable ? Unlock : Lock}
          title={
            isEditable ? "Switch to summary mode" : "Switch to editable mode"
          }
          titleSide="right"
          iconColor="muted"
          onClick={() => editableDatesData.actions.toggle(date)}
        />
        <div className="flex-1" />
        <DateDurations entries={entries} />
      </div>
    </>
  )
}
