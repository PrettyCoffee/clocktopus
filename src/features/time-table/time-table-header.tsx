import { Dispatch, useMemo, useState } from "react"

import { Lock, Unlock } from "lucide-react"

import { Checkbox } from "components/ui/checkbox"
import { IconButton } from "components/ui/icon-button"
import { Tooltip } from "components/ui/tooltip"
import { projectsData } from "data/projects"
import { type TimeEntry } from "data/time-entries"
import { ProjectName } from "features/components/project-name"
import { useIntersectionObserver } from "hooks/use-intersection-observer"
import { useAtomValue } from "lib/yaasl"
import { cn } from "utils/cn"
import { hstack, vstack } from "utils/styles"
import { timeHelpers } from "utils/time-helpers"

import { CheckedState, useCheckedState } from "./checked-context"
import { Duration } from "./duration"

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

const uncheck = (checked: CheckedState, { date, id }: TimeEntry) => {
  if (checked[date]?.[id]) {
    delete checked[date][id]
  }
  if (Object.keys(checked[date] ?? {}).length === 0) {
    delete checked[date]
  }
  return checked
}

const check = (checked: CheckedState, { date, id }: TimeEntry) => {
  checked[date] = { ...checked[date] }
  checked[date][id] = true
  return checked
}

interface TimeTableHeaderProps {
  title: string
  entries: TimeEntry[]
  hideTotal?: boolean
  locked?: {
    value: boolean
    onChange: Dispatch<boolean>
  }
}
export const TimeTableHeader = ({
  title,
  entries,
  hideTotal,
  locked,
}: TimeTableHeaderProps) => {
  const { checked, onCheckedChange } = useCheckedState()
  const [topOffset, setTopOffset] = useState("0px")
  const { ref, isIntersecting } = useIntersectionObserver({
    rootMargin: `-${topOffset} 0px 0px 0px`, // trigger offset to the top of the scroll area (window)
  })

  const checkedState = useMemo(() => {
    const hasChecked = entries.some(({ date, id }) => checked[date]?.[id])
    const hasUnchecked = entries.some(({ date, id }) => !checked[date]?.[id])
    return hasChecked ? (hasUnchecked ? "indeterminate" : true) : false
  }, [checked, entries])

  const handleCheckedChange = (value: boolean) => {
    onCheckedChange(checked =>
      entries.reduce(
        (result, entry) =>
          value ? check(result, entry) : uncheck(result, entry),
        { ...checked }
      )
    )
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
        {!locked?.value && (
          <Checkbox
            checked={checkedState}
            onCheckedChange={handleCheckedChange}
            className="ml-1"
          />
        )}
        <h2 className="mr-2 ml-3 text-base">{title}</h2>
        {locked && (
          <IconButton
            icon={locked.value ? Lock : Unlock}
            title={
              locked.value
                ? "Switch to editable mode"
                : "Switch to summary mode"
            }
            titleSide="right"
            iconColor="muted"
            onClick={() => locked.onChange(!locked.value)}
          />
        )}
        <div className="flex-1" />
        {!hideTotal && <DateDurations entries={entries} />}
      </div>
    </>
  )
}
