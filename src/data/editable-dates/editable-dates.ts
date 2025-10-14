import { createSlice } from "lib/yaasl"
import { dateHelpers } from "utils/date-helpers"

const defaultValue: Record<string, true> = {
  [dateHelpers.today()]: true,
}

export const editableDatesData = createSlice({
  name: "locaked-dates",
  defaultValue,
  reducers: {
    toggle: (state, date: string) => {
      const { [date]: existing, ...rest } = state
      return existing ? rest : { ...rest, [date]: true }
    },
  },
})
