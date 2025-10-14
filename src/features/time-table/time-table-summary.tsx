import { useMemo } from "react"

import { Divider } from "components/ui/divider"
import { type TimeEntry } from "data/time-entries"
import { ProjectName } from "features/components/project-name"
import { cn } from "utils/cn"
import { hstack, surface, vstack } from "utils/styles"
import { timeHelpers } from "utils/time-helpers"

import { Duration } from "./duration"

interface EntrySummary {
  id: string
  description: string
  projectId: string
  minutes: number
}

const summarize = (entries: TimeEntry[]): EntrySummary[] => {
  const clustered = entries.reduce<Record<string, Record<string, number>>>(
    (result, { description, projectId = "", start, end }) => {
      if (!result[projectId]) {
        result[projectId] = {}
      }
      if (result[projectId][description] == null) {
        result[projectId][description] = 0
      }
      result[projectId][description] += timeHelpers.getDiff(start, end)
      return result
    },
    {}
  )

  return Object.entries(clustered)
    .flatMap(([projectId, descriptions]) =>
      Object.entries(descriptions).map(([description, minutes]) => ({
        id: `${description}-${projectId}`,
        projectId,
        description,
        minutes,
      }))
    )
    .sort((a, b) =>
      a.description && !b.description
        ? -1
        : !a.description && b.description
          ? 1
          : b.minutes - a.minutes
    )
}

const SummaryBlock = ({ description, projectId, minutes }: EntrySummary) => (
  <div className={cn(surface({ look: "card", size: "md" }), vstack({}))}>
    <div className={cn("line-clamp-2", !description && "text-text-muted")}>
      {description || "No description"}
    </div>

    <div className="flex-1" />

    <Divider color="gentle" className="my-2" />
    <div className={hstack({ justify: "between" })}>
      <ProjectName projectId={projectId} />
      <Duration minutes={minutes} />
    </div>
  </div>
)

export const TimeTableSummary = ({ entries }: { entries: TimeEntry[] }) => {
  const summary = useMemo(() => summarize(entries), [entries])

  return (
    <div className="@container m-2">
      <div className="grid grid-cols-1 gap-4 @xl:grid-cols-2 @3xl:grid-cols-3">
        {summary.map(entry => (
          <SummaryBlock key={entry.projectId + entry.description} {...entry} />
        ))}
      </div>
    </div>
  )
}
