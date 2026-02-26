import { Dispatch, useRef } from "react"

import { categoriesData, categoryGroupsData } from "data/categories"
import { TimeEntry } from "data/time-entries"
import { useAtom } from "lib/yaasl"
import { cn } from "utils/cn"
import { colored } from "utils/styles"
import { timeHelpers } from "utils/time-helpers"

const normalize = (value: number, min: number, max: number) =>
  (value - min) / (max - min)

interface TrackedTimelineProps {
  entries: TimeEntry[]
  onHover: Dispatch<number | undefined>
}
export const TrackedTimeline = ({ entries, onHover }: TrackedTimelineProps) => {
  const categories = useAtom(categoriesData)
  const groups = useAtom(categoryGroupsData)

  const startTime = timeHelpers.toMinutes(entries.at(-1)?.start ?? "")
  const endTime = timeHelpers.toMinutes(entries.at(0)?.end ?? "")

  const getRange = (entry: TimeEntry) => {
    const start = normalize(
      timeHelpers.toMinutes(entry.start),
      startTime,
      endTime
    )
    const end = normalize(timeHelpers.toMinutes(entry.end), startTime, endTime)
    return {
      bottom: start * 100 + "%",
      height: (end - start) * 100 + "%",
    }
  }

  const getColor = (categoryId?: string) => {
    const category = categories.find(({ id }) => id === categoryId)
    const group = groups.find(({ id }) => id === category?.groupId)
    return group?.color
  }

  const lastHover = useRef<number>(undefined)
  const handleHover = (index: number) => {
    if (lastHover.current === index) return
    lastHover.current = index
    onHover(index)
  }
  const handleHoverEnd = (index: number) => {
    setTimeout(() => {
      if (lastHover.current !== index) return
      lastHover.current = undefined
      onHover(undefined)
    }, 100)
  }

  return (
    <div className="absolute inset-y-0 left-full">
      {entries.map((entry, index) => {
        const color = getColor(entry.categoryId)
        return (
          <span
            key={entry.id}
            onMouseMove={() => handleHover(index)}
            onMouseEnter={() => handleHover(index)}
            onMouseLeave={() => handleHoverEnd(index)}
            onTouchStart={() => handleHover(index)}
            onTouchEnd={() => handleHoverEnd(index)}
            style={getRange(entry)}
            className={cn(
              "absolute block w-8 px-3 opacity-50 transition-[padding] duration-100",
              "hover:px-2 hover:opacity-75",
              "first-of-type:*:rounded-t-full first-of-type:*:border-t-0 last-of-type:*:rounded-b-full last-of-type:*:border-b-0"
            )}
          >
            <div
              className={cn(
                color
                  ? colored({ color, type: "bg" })
                  : "bg-background-invert/25",
                "size-full border-y border-y-background-page"
              )}
            />
          </span>
        )
      })}
    </div>
  )
}
