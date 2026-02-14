import { Dispatch, SetStateAction } from "react"

import { t } from "@lingui/core/macro"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { IconButton } from "components/ui/icon-button"
import { ScrollArea } from "components/utility/scroll-area"
import { timeEntriesData } from "data/time-entries"
import { useAtom } from "lib/yaasl"
import { cn } from "utils/cn"
import { hstack } from "utils/styles"

import { selectedYear } from "./selected-year"
import { Year } from "./year"

const Divider = () => (
  <div className="my-1 mb-2 ml-1 border-b border-stroke-gentle" />
)

const getYears = (dates: string[]) => {
  const years = [...new Set(dates.map(date => date.split("-")[0]!).map(Number))]
  return years
}

const currentYear = new Date().getFullYear()

const YearCarousel = ({
  year,
  setYear,
}: {
  year: number
  setYear: Dispatch<SetStateAction<number>>
}) => {
  const trackedDates = useAtom(timeEntriesData.selectors.getTrackedDates)
  const years = getYears(trackedDates)

  return (
    <div className={hstack({ justify: "between", align: "center" })}>
      <IconButton
        icon={ChevronLeft}
        title={t`Previous year`}
        size="sm"
        onClick={() => setYear(year => year - 1)}
      />

      <span
        className={cn("select-none", !years.includes(year) && "opacity-50")}
      >
        {year}
      </span>

      <IconButton
        icon={ChevronRight}
        title={t`Next year`}
        size="sm"
        onClick={() => setYear(year => year + 1)}
        disabled={year === currentYear}
      />
    </div>
  )
}

export const WeekCalendar = () => {
  const year = useAtom(selectedYear)

  return (
    <>
      <YearCarousel year={year} setYear={next => selectedYear.set(next)} />
      <Divider />
      <ScrollArea className="-mr-1 flex-1" innerClassName="py-2 pr-2">
        <Year year={year} />
      </ScrollArea>
    </>
  )
}
