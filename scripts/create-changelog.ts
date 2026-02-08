import { git } from "@pretty-cozy/release-tools"

const getLastTag = async () => {
  const tags = await git.allTags()
  return tags.at(-1)!
}

type Commit = Awaited<ReturnType<typeof git.getCommits>>[number]

const sortCommits = (a: Commit, b: Commit) => {
  const scopeA = a.parsed?.scope ?? ""
  const scopeB = b.parsed?.scope ?? ""
  if (scopeA !== scopeB) return scopeA.localeCompare(scopeB)

  const messageA = a.parsed?.message ?? ""
  const messageB = b.parsed?.message ?? ""
  return messageA.localeCompare(messageB)
}

const printCommit = (commit: Commit) => {
  const content = commit.parsed?.scope
    ? `**${commit.parsed.scope}:** ${commit.parsed.message}`
    : `${commit.parsed?.message}`
  return `- ${content}\n`
}

const getToday = () => new Date().toISOString().split("T")[0]

const printChangelog = ({
  version,
  commits,
}: {
  version: string
  commits: Commit[]
}) => {
  let result = `# ${version} (${getToday()})\n`

  if (commits.length === 0) {
    result += "\nNo changes\n"
    return result
  }

  const {
    breaking = [],
    feat = [],
    fix = [],
  } = commits.reduce<Record<string, Commit[]>>(
    (acc, commit) => {
      if (commit.parsed?.breaking) {
        acc["breaking"]?.push(commit)
      } else {
        acc[commit.parsed?.type ?? ""]?.push(commit)
      }
      return acc
    },
    { breaking: [], feat: [], fix: [] }
  )

  if (breaking.length > 0) {
    result += "\n## Breaking Changes\n\n"
    breaking.forEach(commit => (result += printCommit(commit)))
  }

  if (feat.length > 0) {
    result += "\n## Features\n\n"
    feat.forEach(commit => (result += printCommit(commit)))
  }

  if (fix.length > 0) {
    result += "\n## Bug Fixes\n\n"
    fix.forEach(commit => (result += printCommit(commit)))
  }

  return result
}

export const createChangelog = async (version: string) => {
  const commits = await git.getCommits(await getLastTag())
  const changes = commits.toSorted(sortCommits)

  return printChangelog({ version, commits: changes })
}
