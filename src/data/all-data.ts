import { z } from "zod"

import { themeData, themeSchema } from "data/theme"
import { createDerived } from "lib/yaasl"
import { Resolve } from "types/util-types"

const allDataSchema = z.object({
  theme: z.optional(themeSchema),
})

export type AllData = Resolve<z.infer<typeof allDataSchema>>

const data = createDerived<AllData>(
  ({ get }) => {
    const theme = get(themeData)
    return { theme }
  },

  ({ value, set }) => {
    if (value.theme) set(themeData, value.theme)
  }
)

export const allData = {
  get: () => data.get(),

  validate: (data: unknown) => allDataSchema.parse(data),

  patch: (value: Partial<AllData>) =>
    data.set(state => ({ ...state, ...value })),

  reset: () =>
    data.set({
      theme: themeData.defaultValue,
    }),
}
