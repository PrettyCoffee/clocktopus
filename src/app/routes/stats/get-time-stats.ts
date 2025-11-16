import { projectsData } from "data/projects"
import { TimeEntry } from "data/time-entries"
import { timeHelpers } from "utils/time-helpers"

const average = (numbers: number[]) => {
  const sum = numbers.reduce((sum, value) => sum + value, 0)
  return sum / numbers.length
}

const getProject = (projectId?: string) =>
  projectsData.get().find(project => project.id === projectId)

export interface TimeStats {
  start: number
  end: number
  total: number
}

export const getTimeStats = (
  entries: Record<string, TimeEntry[]>
): TimeStats | null => {
  const total: number[] = []
  const start: number[] = []
  const end: number[] = []

  Object.values(entries).forEach(entries => {
    const times = entries.flatMap(({ start, end, projectId }) =>
      getProject(projectId)?.isPrivate
        ? []
        : {
            start: timeHelpers.toMinutes(start),
            end: timeHelpers.toMinutes(end),
          }
    )
    if (times.length === 0) return

    const dateStart = Math.min(...times.map(({ start }) => start))
    const dateEnd = Math.max(...times.map(({ end }) => end))

    const totalTime = times.reduce((total, { start, end }) => {
      const duration = end - start
      return total + duration
    }, 0)

    start.push(dateStart)
    end.push(dateEnd)
    total.push(totalTime)
  })

  if (total.length === 0) return null

  return {
    start: average(start),
    end: average(end),
    total: average(total),
  }
}
