import fs from "node:fs/promises"
import { resolve, join } from "node:path"

import { $ } from "@pretty-cozy/release-tools"

const ROOT_DIR = resolve("./")
const BUILD_DIR = "dist"
const TMP_DIR = "_tmp_release_build"

const getAbsolutePath = (path: string) => {
  const absolute = resolve(path)

  if (!absolute.includes(ROOT_DIR)) {
    // to protect you and me from big oopsies when running `rm -rf ${pwd}`
    console.error(`Cannot escape project directory. path: ${absolute}\n`)
    process.exit(1)
  }

  return absolute
}

const rm = (path: string) => {
  const absolute = getAbsolutePath(path)
  return fs.rm(absolute, { force: true, recursive: true })
}

const getLatestTag = async () => {
  const tagRef = await $`git rev-list --tags --max-count=1`.text()
  const tag = await $`git describe --tags ${tagRef}`.text()
  return tag.trim()
}

type ShellFn = (...args: Parameters<typeof $>) => PromiseLike<string>

const createWorktree = async (path: string, name: string) => {
  const pwd = getAbsolutePath(path)

  const remove = async () => {
    await $`git worktree remove -f ${pwd}`.noThrow().quiet()
    await rm(pwd)
  }
  await remove()

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
    rm: remove,
  }
}

const build = async ($: ShellFn, name: string) => {
  console.info(`🏗️ Build ${name}:`)
  await $`pnpm i`
  console.info(`   √ installed dependencies`)
  await $`pnpm run l10n:build`
  console.info(`   √ extracted translations`)
  await $`pnpm exec vite build --outDir="./${BUILD_DIR}"`
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
    await rm("./dist")
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
