import { useState } from "react"

import {
  FileJson2,
  HardDriveDownload,
  Trash,
  FileSpreadsheet,
} from "lucide-react"
import { ZodError } from "zod"

import { Button } from "components/ui/button"
import { Card } from "components/ui/card"
import { showDialog } from "components/ui/dialog"
import { FileInput } from "components/ui/file-input/file-input"
import { Spinner } from "components/ui/spinner"
import { showToast } from "components/ui/toaster"
import { allData, AllData } from "data/all-data"
import { TimeEntry, timeEntriesData } from "data/time-entries"
import { CsvImport } from "features/csv-import"
import { cn } from "utils/cn"
import { dateHelpers } from "utils/date-helpers"
import { download } from "utils/download"
import { sleep } from "utils/sleep"
import { hstack, vstack } from "utils/styles"

import { OrChain } from "./fragments/or-chain"

const exportData = () => {
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

const importData = async (file: File) => {
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

const BackupData = () => (
  <Card
    title="Backup data"
    description={
      "Backup your data and import your backups. " +
      "This is important since your data is only stored locally in your browser. " +
      "Resetting your browser's data will also delete all data and settings of Clocktopus."
    }
  >
    <OrChain>
      <Button look="key" icon={HardDriveDownload} onClick={exportData}>
        Export data
      </Button>

      <FileInput
        label="Import data"
        onChange={file => void importData(file)}
        accept=".json"
        icon={FileJson2}
      />
    </OrChain>
  </Card>
)

const splitByDates = (data: TimeEntry[]) =>
  data.reduce<Record<string, TimeEntry[]>>((result, entry) => {
    const date = entry.date
    if (!date) return result

    if (!result[date]) result[date] = []
    result[date].push(entry)
    return result
  }, {})

const processWithPauses = async ([
  current,
  ...chain
]: (() => void | Promise<void>)[]): Promise<void> => {
  if (!current) return
  try {
    await current()
  } catch {
    // don't abort chain if one item fails
  }

  await sleep(50)
  return processWithPauses(chain)
}

const CsvImportProgress = ({
  current,
  total,
}: {
  current: number
  total: number
}) => {
  const percent = Math.round((current / total) * 100)
  return (
    <div className={cn(hstack({ align: "center", gap: 2 }))}>
      <Spinner size="sm" /> Importing data ({percent}%)
    </div>
  )
}

const importCsv = async (data: TimeEntry[]) => {
  const progress = {
    total: data.length,
    current: 0,
  }

  const toast = showToast({
    kind: "info",
    title: "CSV Import",
    duration: 0,
    message: <CsvImportProgress {...progress} />,
  })

  const byDate = splitByDates(data)
  await processWithPauses(
    Object.entries(byDate).map(([date, entries]) => () => {
      timeEntriesData.actions.add(date, ...entries)
      progress.current += entries.length
      toast.edit({
        message: <CsvImportProgress {...progress} />,
      })
    })
  )

  toast.edit({
    kind: "success",
    title: "CSV Import",
    message: `Imported ${data.length} entries`,
    duration: 5000,
  })
}

const ImportCsvData = () => {
  const [csv, setCsv] = useState<string | null>(null)
  return (
    <Card
      title="CSV Import / Export"
      description={
        <>
          Import or export a .csv file to move your data between clocktopus and
          other time tracking tools.
          <br />
          <span className="font-bold text-text">Note: </span>
          The new data will be added to your existing data! Make sure to create
          a backup before starting the import. If you want a clean start, delete
          your data first.
        </>
      }
    >
      <OrChain>
        <Button
          look="ghost"
          icon={HardDriveDownload}
          onClick={() => null}
          disabled
        >
          Export .csv
        </Button>

        <FileInput
          label="Import .csv"
          onChange={file => void file.text().then(setCsv)}
          accept=".csv"
          icon={FileSpreadsheet}
        />
      </OrChain>

      {csv && (
        <CsvImport
          csv={csv}
          onImport={data => void importCsv(data)}
          onClose={() => setCsv(null)}
        />
      )}
    </Card>
  )
}

const requestDeletion = () =>
  showDialog({
    title: "Delete all data",
    description:
      "Do you want to delete all data and reset Clocktopus to its initial state?",
    confirm: {
      caption: "Confirm deletion",
      look: "destructive",
      onClick: () => {
        allData.reset()
        showToast({
          kind: "success",
          title: "Deleted data",
        })
      },
    },
    cancel: {
      caption: "Cancel",
      look: "flat",
    },
  })

const DeleteData = () => (
  <Card
    title="Delete data"
    description={
      <>
        Delete all data and reset Clocktopus to its initial state.
        <br />
        <span className="font-bold text-text">Note: </span>
        Make sure to create a backup before deleting your data, this cannot be
        undone!
      </>
    }
  >
    <Button look="destructive" icon={Trash} onClick={requestDeletion}>
      Delete all data
    </Button>
  </Card>
)

const Privacy = () => (
  <Card
    title="Data Privacy"
    description={
      <>
        This website is hosted on GitHub Pages. GitHub may collect personal data
        from visitors to this website. For further information, please consult
        the{" "}
        <a
          href="https://help.github.com/en/github/site-policy/github-privacy-statement"
          className="text-highlight opacity-90 hover:underline hover:opacity-100"
        >
          GitHub Privacy Statement
        </a>
        .
        <span className="mb-4 block" />
        Apart the processing described in GitHub's Privacy Statement, this
        website does not collect or track any personal data. Any data you enter
        is stored solely within your browser and is not transmitted to any
        server. Please note that clearing your browser's data may reset this
        website to its initial state and result in the loss of any data you have
        entered.
      </>
    }
  />
)

export const SettingsData = () => (
  <div className={cn(vstack({ gap: 2 }))}>
    <Privacy />
    <BackupData />
    <ImportCsvData />
    <DeleteData />
  </div>
)
