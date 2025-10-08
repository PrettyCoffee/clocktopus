const matches = (text: string, search: string) =>
  new RegExp(`(${search})`, "gm").exec(text)?.length ?? 0

const detectSeparator = (csv: string) => {
  const commas = matches(csv, ",")
  const semicolons = matches(csv, ";")

  return semicolons > commas ? ";" : ","
}

const cleanFieldValue = (text: string) => {
  const trimmed = text.trim()
  // eslint-disable-next-line unused-imports/no-unused-vars
  const [_full, match] = /^["'](.*)["']$/.exec(trimmed) ?? []
  return match ?? trimmed
}

export const processCsv = (csv: string) => {
  const lines = csv.split(/[\n\r]+/)
  const separator = detectSeparator(csv)

  const [headers = [], ...rows] = lines.map(line =>
    line.split(separator).map(cleanFieldValue)
  )
  return { headers, rows }
}
