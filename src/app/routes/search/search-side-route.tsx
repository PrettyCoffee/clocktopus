import { t } from "@lingui/core/macro"
import { Trans } from "@lingui/react/macro"
import { Trash } from "lucide-react"

import { Button } from "components/ui/button"
import { Divider } from "components/ui/divider"
import { IconButton } from "components/ui/icon-button"
import { InputLabel } from "components/ui/input-label"
import { useTrackedYears } from "data/time-entries"
import { useAtom } from "lib/yaasl"
import { cn } from "utils/cn"
import { hstack, vstack } from "utils/styles"

import { savedFilters, searchText } from "./search-data"

export const SearchSideRoute = () => {
  const years = useTrackedYears()
  const currentFilter = useAtom(searchText)

  const filters = useAtom(savedFilters)
  return (
    <div>
      <InputLabel label={t`Predefined Filters`} />
      {years.map(year => {
        const filter = `year:${year}`
        return (
          <Button
            key={year}
            active={currentFilter === filter}
            onClick={() => searchText.set(filter)}
          >
            {year}
          </Button>
        )
      })}

      <Divider color="gentle" className="my-4" />

      <InputLabel label={t`Saved Filters`} />
      {filters.length === 0 && (
        <span className="text-sm text-text-gentle">
          <Trans>You didn't save any filters yet</Trans>
        </span>
      )}

      <div className={vstack({ gap: 1 })}>
        {filters.map(filter => (
          <div
            key={filter.id}
            className={cn(hstack({}), "rounded-md border border-stroke-gentle")}
          >
            <Button
              className="flex-1 justify-start"
              active={currentFilter === filter.value}
              onClick={() => searchText.set(filter.value)}
            >
              {filter.name}
            </Button>
            <IconButton
              icon={Trash}
              title={t`Delete filter`}
              hideTitle
              onClick={() => savedFilters.actions.delete(filter.id)}
              className="[*:not(:hover,:has(*:focus-visible))>&]:opacity-0"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
