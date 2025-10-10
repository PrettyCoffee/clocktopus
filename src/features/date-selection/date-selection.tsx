import { Dispatch, SetStateAction, useState } from "react"

import { ChevronLeft, ChevronRight } from "lucide-react"

import { IconButton } from "components/ui/icon-button"
import { ScrollArea } from "components/utility/scroll-area"
import { timeEntriesData } from "data/time-entries"
import { useAtomValue } from "lib/yaasl"
import { cn } from "utils/cn"
import { hstack } from "utils/styles"

import { Year } from "./year"

const Divider = () => (
  <div className="my-1 mb-2 ml-1 border-b-1 border-stroke-gentle" />
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
  const trackedDates = useAtomValue(timeEntriesData.selectors.getTrackedDates)
  const years = getYears(trackedDates)

  return (
    <div className={hstack({ justify: "between", align: "center" })}>
      <IconButton
        icon={ChevronLeft}
        title="Previous year"
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
        title="Next year"
        size="sm"
        onClick={() => setYear(year => year + 1)}
        disabled={year === currentYear}
      />
    </div>
  )
}

interface DateSelectionProps {
  initialYear?: number
}
export const DateSelection = ({
  initialYear = currentYear,
}: DateSelectionProps) => {
  const [year, setYear] = useState(initialYear)

  return (
    <>
      <YearCarousel year={year} setYear={setYear} />
      <Divider />
      <ScrollArea className="-mr-1 flex-1" innerClassName="py-2 pr-2">
        <Year year={year} />
      </ScrollArea>
    </>
  )
}
