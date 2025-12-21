import { FilterInput, FilterInputProps } from "components/ui/filter-input"
import { dateHelpers } from "utils/date-helpers"

const isYear = (value: string) => /^\d{4}$/.test(value)
const tagConfigs = {
  category: { example: "Meeting" },
  year: { example: dateHelpers.today().slice(0, 4), validate: isYear },
  until: {
    example: dateHelpers.today(),
    validate: dateHelpers.isValid,
    format: value => {
      if (value.length < 4) return ""
      const date = dateHelpers.parse(isYear(value) ? `${value}-12-31` : value)
      return dateHelpers.stringify(date)
    },
  },
  from: {
    example: dateHelpers.today(),
    validate: dateHelpers.isValid,
    format: value => {
      if (value.length < 4) return ""
      const date = dateHelpers.parse(isYear(value) ? `${value}-01-01` : value)
      return dateHelpers.stringify(date)
    },
  },
} satisfies FilterInputProps<string>["tagConfigs"]

export const SearchFilterInput = (
  props: Pick<
    FilterInputProps<keyof typeof tagConfigs>,
    "value" | "onChange" | "hideSuggestions"
  >
) => (
  <FilterInput
    className="block flex-1"
    placeholder="Search for time entries"
    tagConfigs={tagConfigs}
    {...props}
  />
)
