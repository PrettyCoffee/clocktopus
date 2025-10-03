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

const matchScore = (item: string, query: string) => {
  const itemWords = item.toLowerCase().split(/\s+/)
  const queryWords = query.toLowerCase().split(/\s+/)

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

const normalize = (text: string) => text.toLowerCase()

interface FilterProps<TData> {
  items: TData[]
  filter: string
  getFilterValue: (item: TData) => string
  maxItems: number
}

export const fuzzyFilter = <TData>({
  items,
  filter,
  getFilterValue,
  maxItems,
}: FilterProps<TData>) => {
  if (!filter) return []

  const normalizedFilter = normalize(filter)
  return items
    .flatMap(item => {
      const itemValue = normalize(getFilterValue(item))
      if (normalizedFilter === itemValue) return []
      const score = matchScore(itemValue, normalizedFilter)
      if (score > 2) return []
      return { item, score }
    })
    .sort((a, b) => a.score - b.score)
    .slice(0, maxItems)
    .map(({ item }) => item)
}
