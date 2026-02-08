import { resolve, join } from "node:path"

import { $ } from "bun"

const ROOT_DIR = resolve("./")
const BUILD_DIR = "dist"
const TMP_DIR = "_tmp_release_build"

const getAbsolutePath = (path: string) => {
  const pwd = resolve(path)

  if (!pwd.includes(ROOT_DIR)) {
    // to protect you and me from big oopsies when running `rm -rf ${pwd}`
    console.error(`Cannot escape project directory. path: ${pwd}\n`)
    process.exit(1)
  }

  return pwd
}

const rm = async (path: string) => {
  const pwd = resolve(path)

  if (!pwd.includes(ROOT_DIR)) {
    // to protect you and me from big oopsies when running `rm -rf ${pwd}`
    console.error(
      `Cannot delete files outside of project directory. path: ${pwd}\n`
    )
    process.exit(1)
  }

  await $`rm -rf ${pwd}`.quiet()
}

const getLatestTag = async () =>
  $`git describe --tags $(git rev-list --tags --max-count=1)`
    .text()
    .then(out => out.trim())

type ShellFn = (...args: Parameters<typeof $>) => Promise<string>

const createWorktree = async (path: string, name: string) => {
  const pwd = getAbsolutePath(path)

  await $`git worktree add -f ${pwd} ${name}`.quiet()

  const shell: ShellFn = (...args: Parameters<ShellFn>) =>
    $(...args)
      .cwd(pwd)
      .text()

  return {
    name,
    path,
    $: shell,
    mv: (source: string, target: string) =>
      $`mv -f "${join(pwd, source)}" "${join(ROOT_DIR, target)}"`.quiet(),
    rm: async () => {
      await $`git worktree remove -f ${pwd}`.quiet()
      await rm(pwd)
    },
  }
}

const build = async ($: ShellFn, name: string) => {
  console.info(`🏗️ Build ${name}:`)
  await $`bun install --frozen-lockfile`
  console.info(`   √ installed dependencies`)
  await $`bun run l10n:build`
  console.info(`   √ extracted translations`)
  await $`vite build --outDir="./${BUILD_DIR}"`
  console.info(`   √ bundled app`)
  console.info("")
}

const main = async () => {
  try {
    const tag = await getLatestTag()

    const prod = await createWorktree(
      `./${TMP_DIR}/worktree-clocktopus-prod/`,
      tag
    )
    const main = await createWorktree(
      `./${TMP_DIR}/worktree-clocktopus-main/`,
      "main"
    )

    await build(main.$, main.name)
    await build(prod.$, prod.name)

    console.info("📦️ Creating final package...")
    await $`rm -rf ./dist`.quiet().catch()
    await prod.mv(BUILD_DIR, "./dist/")
    await main.mv(BUILD_DIR, "./dist/dev")

    console.info("🧼 Cleaning up...")
    await prod.rm()
    await main.rm()
    await rm(TMP_DIR)
  } catch (error) {
    console.error("⚠️ Error: Something went wrong\n")
    console.error(error)
  }
}

await main()
