import { useTrackedDates } from "data/time-entries"
import { TimeTable } from "features/time-table"
import { CreateTimeEntry } from "features/time-table/create-time-entry"
import { useIntersectionObserver } from "hooks/use-intersection-observer"
import { cn } from "utils/cn"

const MainRoute = () => {
  const trackedDates = useTrackedDates()
  const { ref, isIntersecting } = useIntersectionObserver()
  return (
    <div className="px-10">
      <div ref={ref} />
      <div
        className={cn(
          "sticky top-0 rounded-md bg-background-page pt-6 pb-2",
          !isIntersecting && "z-20 -mx-2 shade-low px-2"
        )}
      >
        <CreateTimeEntry />
      </div>

      <div className="mt-4 space-y-4">
        {trackedDates.map(date => (
          <TimeTable key={date} date={date} />
        ))}
      </div>

      <div className="pb-10" />
    </div>
  )
}

export default MainRoute
