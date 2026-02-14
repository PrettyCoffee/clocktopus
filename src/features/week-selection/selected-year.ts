import { createAtom } from "lib/yaasl"

export const selectedYear = createAtom({
  name: "selected-year",
  defaultValue: new Date().getFullYear(),
})
