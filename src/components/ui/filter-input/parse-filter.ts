export interface TagConfig {
  validate: (value: string) => boolean
  format?: (value: string) => string
}

interface Token {
  type: "value" | "symbol" | "none"
  text: string
  value: string
  last?: Token
  next?: Token
}

interface FilterItem {
  tag?: string
  value: string
  text: string
}

const normalizeValue = (value: string) =>
  value.replaceAll('"', "").trim().replaceAll(/\s+/g, " ")

interface TokenSplit extends Omit<Token, "last" | "next"> {
  rest: string
}

const splitWhitespace = (string: string): TokenSplit | null => {
  const [, text = "", rest = ""] = /^(\s+)(.*)/.exec(string) ?? []
  if (!text) return null
  return { type: "none", text, value: "", rest }
}

const splitQuotes = (string: string): TokenSplit | null => {
  const [, text = "", value = "", rest = ""] =
    /^("([^"]*)"?)(.*)/.exec(string) ?? []
  if (!text) return null
  return { type: "value", text, value: normalizeValue(value), rest }
}

const splitTag = (string: string): TokenSplit | null => {
  const [, text = "", rest = ""] = /^(:+)(.*)/.exec(string) ?? []
  if (!text) return null
  return { type: "symbol", text, value: ":", rest }
}

const splitWord = (string: string): TokenSplit | null => {
  const [, text = "", rest = ""] = /^([^\s":]+)(.*)/.exec(string) ?? []
  if (!text) return null
  return { type: "value", text, value: normalizeValue(text), rest }
}

const swallowRest = (string: string): TokenSplit => ({
  type: "value",
  text: string,
  value: normalizeValue(string),
  rest: "",
})

const nextToken = (text: string, lastToken?: Token) => {
  const result =
    splitWhitespace(text) ??
    splitQuotes(text) ??
    splitTag(text) ??
    splitWord(text) ??
    swallowRest(text)

  const token: Token = {
    type: result.type,
    text: result.text,
    value: result.value,
    last: lastToken,
    next: undefined,
  }

  if (result.rest) {
    token.next = nextToken(result.rest, token)
  }

  return token
}

const isTagSymbol = (token?: Token) =>
  token?.type === "symbol" && token.value === ":"

// eslint-disable-next-line complexity -- refactoring will make it more complex
const aggregateTokens = (first: Token) => {
  const items: FilterItem[] = []

  let token: Token | undefined = first
  while (token) {
    const nextToken: Token | undefined = token.next
    const lastToken = token.last

    if (isTagSymbol(nextToken)) {
      // Skip this one and proceed below
      token = nextToken
      continue
    }

    if (isTagSymbol(token)) {
      items.push({
        tag: lastToken?.value,
        value: nextToken?.value ?? "",
        text: `${lastToken?.text ?? ""}${token.text}${nextToken?.text ?? ""}`,
      })
      token = nextToken?.next
      continue
    }

    const lastItem = items.at(-1)
    if (lastItem && !lastItem.tag) {
      lastItem.value = normalizeValue(`${lastItem.value} ${token.value}`)
      lastItem.text += token.text
    } else {
      items.push({ value: token.value, text: token.text })
    }
    token = nextToken
  }

  return items
}

export interface EnrichedFilterItem extends FilterItem {
  isTagValid: boolean
  isValueValid: boolean
}

const enrichItems = (
  items: FilterItem[],
  tagConfigs: Record<string, TagConfig>
): EnrichedFilterItem[] =>
  items.map(({ tag, value, text }) => {
    const config = tagConfigs[tag ?? ""]
    return {
      tag,
      value,
      text,
      isTagValid: !!config || tag == null,
      isValueValid: config?.validate(value) ?? (!!value || tag == null),
    }
  })

export interface Filters<TTagName extends string> {
  text: string
  tags: Partial<Record<TTagName, string>>
}
const aggregateFilterResult = <TTagName extends string>(
  items: EnrichedFilterItem[],
  tagConfigs: Record<TTagName, TagConfig>
) => {
  const initial: Filters<TTagName> = {
    text: "",
    tags: {},
  }

  return items.reduce((result, { tag, value, isTagValid, isValueValid }) => {
    if (!isTagValid || !isValueValid) return result

    if (tag == null) {
      result.text = normalizeValue(`${result.text} ${value}`)
    } else if (tag in tagConfigs) {
      const { format = value => value } = tagConfigs[tag as TTagName]
      result.tags[tag as TTagName] = format(normalizeValue(value))
    }
    return result
  }, initial)
}

export const parseFilter = <TTagName extends string>(
  filter: string,
  tagConfigs: Record<TTagName, TagConfig>
) => {
  const first = nextToken(filter)
  const items = aggregateTokens(first)

  const enriched = enrichItems(items, tagConfigs)
  const filterResult = aggregateFilterResult(enriched, tagConfigs)

  return { segments: enriched, ...filterResult }
}
