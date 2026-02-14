import { t } from "@lingui/core/macro"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"

import { IconButton } from "components/ui/icon-button"
import { useAtom } from "lib/yaasl"
import { cn } from "utils/cn"
import { hstack } from "utils/styles"

import { getWeekNumber, selectedWeek } from "./selected-week"

const currentYear = new Date().getFullYear()
const currentWeek = getWeekNumber(new Date()).week

export const WeekCarousel = () => {
  const week = useAtom(selectedWeek)
  const year = week.year

  const nextWeek = () => {
    selectedWeek.actions.selectWeek(week.year, week.calendarWeek + 1)
  }

  const previousWeek = () => {
    selectedWeek.actions.selectWeek(week.year, week.calendarWeek - 1)
  }

  const nextYear = () => {
    selectedWeek.actions.selectWeek(week.year + 1, week.calendarWeek)
  }

  const previousYear = () => {
    selectedWeek.actions.selectWeek(week.year - 1, week.calendarWeek)
  }

  const isCurrentWeek = year >= currentYear && week.calendarWeek >= currentWeek

  return (
    <div className={hstack({ justify: "between", align: "center" })}>
      <IconButton
        icon={ChevronsLeft}
        title={t`Previous year`}
        size="sm"
        onClick={previousYear}
      />
      <IconButton
        icon={ChevronLeft}
        title={t`Previous week`}
        size="sm"
        onClick={previousWeek}
      />

      <span className={cn("inline-block min-w-30 text-center select-none")}>
        {week.year}, {t`CW`} {week.calendarWeek}
      </span>

      <IconButton
        icon={ChevronRight}
        title={t`Next week`}
        size="sm"
        onClick={nextWeek}
        disabled={isCurrentWeek}
      />
      <IconButton
        icon={ChevronsRight}
        title={t`Next year`}
        size="sm"
        onClick={nextYear}
        disabled={isCurrentWeek}
      />
    </div>
  )
}
