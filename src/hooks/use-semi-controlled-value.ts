import { useEffect, useState } from "react"

/** Note: This is an anti pattern since it is mixing controlled / uncontrolled behavior, but in some cases it just works™
 **/
export const useSemiControlledValue = <T>(controlledValue: T) => {
  const [value, setValue] = useState(controlledValue)

  useEffect(() => {
    setValue(controlledValue)
  }, [controlledValue])

  return [value, setValue] as const
}
