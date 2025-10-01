import { Fragment } from "react/jsx-runtime"

import { Year } from "./year"

const Divider = () => (
  <div className="my-1 ml-6 border-b-1 border-stroke-gentle" />
)

interface DateSelectionProps {
  years: number[]
}
export const DateSelection = ({ years }: DateSelectionProps) => (
  <>
    {years.map((year, index) => (
      <Fragment key={year}>
        {index !== 0 && <Divider />}
        <Year year={year} />
      </Fragment>
    ))}
  </>
)
