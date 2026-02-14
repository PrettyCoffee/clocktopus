import { Dispatch, useMemo, useState } from "react"

import { t } from "@lingui/core/macro"
import { Lock, Unlock } from "lucide-react"

import { Checkbox } from "components/ui/checkbox"
import { Divider } from "components/ui/divider"
import { IconButton } from "components/ui/icon-button"
import { Tooltip } from "components/ui/tooltip"
import { DetectIntersection } from "components/utility/detect-intersection"
import { categoriesData } from "data/categories"
import { type TimeEntry } from "data/time-entries"
import { CategoryName } from "features/components/category-name"
import { useAtom } from "lib/yaasl"
import { cn } from "utils/cn"
import { hstack, vstack } from "utils/styles"
import { timeHelpers } from "utils/time-helpers"

import { CheckedState, useCheckedState } from "./checked-context"
import { Duration } from "./duration"

const DateDurations = ({ entries }: { entries: TimeEntry[] }) => {
  const categories = useAtom(categoriesData)

  const totalTimeByCategory = [
    { id: undefined, isPrivate: false },
    ...categories,
  ]
    .map(category => {
      const items = entries.filter(
        // Use "" as fallback to catch entries without categoryId
        entry => (entry.categoryId || "") === (category.id || "")
      )
      const minutes = items.reduce(
        (result, { start, end }) => result + timeHelpers.getDiff(start, end),
        0
      )
      return {
        categoryId: category.id,
        minutes,
        duration: timeHelpers.fromMinutes(minutes),
        isPrivate: category.isPrivate,
      }
    })
    .filter(({ minutes }) => minutes > 0)
    .sort((a, b) => b.minutes - a.minutes)

  const total = totalTimeByCategory.reduce(
    (result, { minutes, isPrivate }) => (isPrivate ? result : result + minutes),
    0
  )
  const totalDuration = (
    <span className="px-4 text-base">
      <span className="text-text-gentle">{t`Total: `}</span>
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
          <span className="mx-auto text-text-gentle">
            {entries.at(-1)?.start} – {entries[0]?.end}
          </span>
          <Divider color="gentle" className="mt-1 mb-2" />
          {totalTimeByCategory.map(({ duration, categoryId }) => (
            <span
              key={categoryId ?? "none"}
              className={hstack({ justify: "between", gap: 2 })}
            >
              <CategoryName categoryId={categoryId} />
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
  showTotal?: boolean
  stickyHeader?: `top-${number}`
  locked?: {
    value: boolean
    onChange: Dispatch<boolean>
  }
}
export const TimeTableHeader = ({
  title,
  entries,
  showTotal,
  stickyHeader,
  locked,
}: TimeTableHeaderProps) => {
  const { checked, onCheckedChange } = useCheckedState()
  const [topOffset, setTopOffset] = useState("0px")
  const [isIntersecting, setIsIntersecting] = useState(false)

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
      <DetectIntersection
        onIntersect={setIsIntersecting}
        options={{
          rootMargin: `-${topOffset} 0px 0px 0px`, // trigger offset to the top of the scroll area (window)
        }}
        disabled={!stickyHeader}
      />
      <div
        ref={element => {
          if (!element) return
          const styles = getComputedStyle(element)
          setTopOffset(styles.top)
        }}
        className={cn(
          hstack({ align: "center" }),
          "h-12 rounded-t-lg border-b border-stroke-gentle bg-background-page",
          stickyHeader && `sticky z-20 ${stickyHeader}`,
          "transition-[box-shadow,border] duration-100",
          !isIntersecting && "rounded-lg shade-low border-transparent"
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
                ? t`Switch to editable mode`
                : t`Switch to summary mode`
            }
            titleSide="right"
            iconColor="muted"
            onClick={() => locked.onChange(!locked.value)}
          />
        )}
        <div className="flex-1" />
        {showTotal && <DateDurations entries={entries} />}
      </div>
    </>
  )
}
