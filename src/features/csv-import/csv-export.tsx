import { categoryGroupsData, categoriesData } from "data/categories"
import { TimeEntry } from "data/time-entries"
import { dateHelpers } from "utils/date-helpers"
import { download } from "utils/download"

const SEPARATOR = ","

interface Header<TData, TKey extends keyof TData = keyof TData> {
  key: TKey
  name?: string
  format?: (value: TData[TKey]) => string
}

const toCsvValue = (value: string) => {
  const escaped = value.replaceAll('"', "'")
  return `"${escaped}"`
}

const toCsv = <TData,>(data: TData[], headers: Header<TData>[]) => {
  const headerRow = headers.map(({ key, name = key }) => name).join(SEPARATOR)
  const createRow = (data: TData) =>
    headers
      .map(({ key, format = String }) => toCsvValue(format(data[key])))
      .join(SEPARATOR)

  return [headerRow, ...data.map(createRow)].join("\n")
}

export const csvExport = (entries: Record<string, TimeEntry[]>) => {
  const allEntries = Object.values(entries)
    .flat()
    .sort((a, b) =>
      `${a.date}_${a.start}_${a.end}`.localeCompare(
        `${b.date}_${b.start}_${b.end}`
      )
    )

  const categories = categoriesData.get()
  const groups = categoryGroupsData.get()
  const getCategoryName = (categoryId?: string) => {
    const current = categories.find(category => category.id === categoryId)
    const group = groups.find(group => group.id === current?.groupId)
    return [group?.name, current?.name].filter(Boolean).join(" - ")
  }

  const csv = toCsv(allEntries, [
    { key: "description", format: description => description ?? "" },
    { key: "categoryId", format: getCategoryName },
    { key: "date" },
    { key: "start" },
    { key: "end" },
  ])

  download(`clocktopus-csv-export_${dateHelpers.today()}.csv`, csv)
}
