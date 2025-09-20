import { Fragment } from "react"

import { useTrackedDates } from "data/time-entries"
import { TimeTable } from "features/time-table"
import { CreateTimeEntry } from "features/time-table/create-time-entry"

const MainRoute = () => {
  const trackedDates = useTrackedDates()
  return (
    <div className="px-10">
      <CreateTimeEntry />

      <div className="mt-4" />

      {trackedDates.map(date => (
        <Fragment key={date}>
          <div className="mt-4" />
          <TimeTable date={date} />
        </Fragment>
      ))}
    </div>
  )
}

export default MainRoute
