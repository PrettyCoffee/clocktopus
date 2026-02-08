import { resolve } from "node:path"

import {
  git,
  promptVersions,
  promptWorkspaces,
  updateVersion,
  color,
  createSpinner,
} from "@pretty-cozy/release-tools"

import { createChangelog } from "./create-changelog"
import pkg from "../package.json"

const mockedWorkspaces: Awaited<ReturnType<typeof promptWorkspaces>> = {
  root: {
    name: pkg.name,
    path: resolve("./"),
    version: pkg.version,
    isPrivate: false,
    ignore: false,
    deps: { peer: [], default: [], dev: [] },
  },
  workspaces: [],
}

const publish = async () => {
  const spinner = createSpinner()
  const { [pkg.name]: version = "" } = await promptVersions(mockedWorkspaces)
  const changelog = await createChangelog(`v${version}`)

  spinner.start(`Publishing ${pkg.name}@${version}`)

  await updateVersion({
    name: pkg.name,
    version: version,
    ...mockedWorkspaces,
  })
  spinner.step("Updated package.json")

  await git.commit({ message: `chore: Release v${version}` })
  spinner.step("Committed changes")

  await git.tag({ version: `v${version}`, message: `Release v${version}` })
  spinner.step("Tagged release")
  spinner.success("Finished, now push the commits and create a new release!")

  console.info(color.blue("\nChangelog:\n"))
  console.info(color.gray(changelog))
}

await publish()
