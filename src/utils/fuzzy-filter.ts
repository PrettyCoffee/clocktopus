const levenshtein = (a: string, b: string) => {
  if (a.length < b.length) [a, b] = [b, a]

  let prev = Array<number>(b.length + 1).fill(0)
  let current = Array<number>(b.length + 1).fill(0)

  for (let j = 0; j <= b.length; j++) prev[j] = j

  for (let i = 1; i <= a.length; i++) {
    current[0] = i
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      current[j] = Math.min(
        prev[j]! + 1,
        current[j - 1]! + 1,
        prev[j - 1]! + cost
      )
    }
    ;[prev, current] = [current, prev]
  }

  return prev[b.length]!
}

const compare = (item: string, query: string) => {
  if (!item || !query) return
  if (item === query) return 0
  if (item.includes(query)) return 0.01

  return
}

const matchScore = (item: string, query: string) => {
  const primitive = compare(item, query)
  if (primitive != null) return primitive

  const itemWords = item.trim().split(/\s+/)
  const queryWords = query.trim().split(/\s+/)

  let total = 0

  for (const queryWord of queryWords) {
    let best = Infinity
    for (const itemWord of itemWords) {
      best = Math.min(best, levenshtein(queryWord, itemWord))
      if (best === 0) break
    }
    total += best
  }

  return total / queryWords.length
}

const normalize = (text: string) =>
  text.toLowerCase().replaceAll(/[^0-9a-z]+/g, " ")

interface FilterProps<TData> {
  items: TData[]
  filter: string
  getFilterValue: (item: TData) => string
}

export const fuzzyFilter = <TData>({
  items,
  filter,
  getFilterValue,
}: FilterProps<TData>) => {
  if (!filter) return []

  return items
    .map(item => {
      const value = getFilterValue(item)
      const score = Math.min(
        matchScore(value.toLowerCase(), filter.toLowerCase()),
        matchScore(normalize(value), normalize(filter)) * 1.1
      )
      return { item, score }
    })
    .filter(({ score }) => score < 2)
    .sort((a, b) => a.score - b.score)
    .map(({ item }) => item)
}
