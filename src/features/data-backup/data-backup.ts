import { ZodError } from "zod"

import { showToast } from "components/ui/toaster"
import { allData, AllData } from "data/all-data"
import { dateHelpers } from "utils/date-helpers"
import { download } from "utils/download"

const downloadBackup = () => {
  download(`clocktopus-export_${dateHelpers.today()}.json`, allData.get())
}

class ImportError extends Error {}
const parse = (content: string): unknown => {
  try {
    return JSON.parse(content)
  } catch {
    throw new ImportError("The file you selected could not be parsed.")
  }
}

const validateData = (data: unknown) => {
  try {
    return allData.validate(data)
  } catch (error) {
    if (!(error instanceof ZodError)) {
      throw error
    }
    const errorPaths = error.issues.flatMap(({ path }) => path).join(", ")
    throw new ImportError(
      `The following data fields seem to be corrupted: ${errorPaths}`
    )
  }
}

const atLeastOneKey = (data: AllData) => {
  if (Object.keys(data).length === 0) {
    throw new ImportError("The file you selected contains no usable data.")
  }
  return data
}

const importBackup = async (file: File) => {
  try {
    const data = await file
      .text()
      .then(parse)
      .then(validateData)
      .then(atLeastOneKey)

    allData.patch(data)
    showToast({
      kind: "success",
      title: "Data imported",
    })
  } catch (error) {
    const message =
      error instanceof ImportError
        ? error.message
        : "An unexpected error occurred during the import."
    showToast({ kind: "error", title: "Import error", message })
    console.error(error)
    return
  }
}

export const dataBackup = {
  import: importBackup,
  download: downloadBackup,
}
