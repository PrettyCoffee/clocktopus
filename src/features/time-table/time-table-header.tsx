import { useState } from "react"

import { Lock, Unlock } from "lucide-react"

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
}
export const TimeTableHeader = ({
  date,
  entries,
  isEditable,
}: TimeTableHeaderProps) => {
  const [topOffset, setTopOffset] = useState("0px")
  const { ref, isIntersecting } = useIntersectionObserver({
    rootMargin: `-${topOffset} 0px 0px 0px`, // trigger offset to the top of the scroll area (window)
  })

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
          "h-11 rounded-t-lg border-b border-stroke-gentle bg-background-page",
          "sticky top-18 z-20",
          !isIntersecting && "rounded-lg"
        )}
      >
        <h2 className="mr-2 pl-4 text-base">{formatDate(date)}</h2>
        <IconButton
          icon={isEditable ? Unlock : Lock}
          title={
            isEditable ? "Switch to summary mode" : "Switch to editable mode"
          }
          titleSide="right"
          iconColor="muted"
          iconSize="sm"
          onClick={() => editableDatesData.actions.toggle(date)}
        />
        <div className="flex-1" />
        <DateDurations entries={entries} />
      </div>
    </>
  )
}
