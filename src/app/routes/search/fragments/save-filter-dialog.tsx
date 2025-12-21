import { Dialog } from "components/ui/dialog"
import { Input } from "components/ui/input"
import { InputLabel } from "components/ui/input-label"
import { useObjectState } from "hooks/use-object-state"

import { Filter, savedFilters } from "../search-data"
import { SearchFilterInput } from "./search-filter-input"

interface SaveFilterDialogProps {
  value: string
  onClose: () => void
}

export const SaveFilterDialog = ({ value, onClose }: SaveFilterDialogProps) => {
  const [filter, updateFilter] = useObjectState<Omit<Filter, "id">>({
    name: "",
    value,
  })

  return (
    <Dialog
      title="Save filter"
      description="Add a name to your filter and save it for quick access in the side menu."
      confirm={{
        caption: "Save",
        onClick: () => savedFilters.actions.add(filter),
        disabled: !filter.name || !filter.value,
      }}
      cancel={{}}
      onClose={onClose}
    >
      <InputLabel label="Name">
        <Input
          type="text"
          value={filter.name}
          onChange={name => updateFilter({ name })}
        />
      </InputLabel>

      <InputLabel label="Filter">
        <SearchFilterInput
          value={filter.value}
          onChange={value => updateFilter({ value })}
          hideSuggestions
        />
      </InputLabel>
    </Dialog>
  )
}
