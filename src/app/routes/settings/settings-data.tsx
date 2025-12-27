import { useState } from "react"

import { t } from "@lingui/core/macro"
import { Trans } from "@lingui/react/macro"
import {
  FileJson2,
  HardDriveDownload,
  Trash,
  FileSpreadsheet,
} from "lucide-react"

import { Button } from "components/ui/button"
import { Card } from "components/ui/card"
import { showDialog } from "components/ui/dialog"
import { FileInput } from "components/ui/file-input/file-input"
import { NumberInput } from "components/ui/number-input"
import { Spinner } from "components/ui/spinner"
import { showToast } from "components/ui/toaster"
import { Toggle } from "components/ui/toggle"
import { allData } from "data/all-data"
import { dataBackupData } from "data/data-backup"
import { TimeEntry, timeEntriesData } from "data/time-entries"
import { CsvImport } from "features/csv-import"
import { csvExport } from "features/csv-import/csv-export"
import { dataBackup } from "features/data-backup"
import { useAtom } from "lib/yaasl"
import { cn } from "utils/cn"
import { sleep } from "utils/sleep"
import { hstack, vstack } from "utils/styles"

import { OrChain } from "./fragments/or-chain"

const BackupData = () => (
  <Card
    title={t`Backup data`}
    description={
      <Trans>
        Backup your data and import your backups. This is important since your
        data is only stored locally in your browser. Resetting your browser's
        data will also delete all data and settings of Clocktopus.
      </Trans>
    }
  >
    <OrChain>
      <Button look="key" icon={HardDriveDownload} onClick={dataBackup.download}>
        <Trans>Export data</Trans>
      </Button>

      <FileInput
        label={t`Import data`}
        onChange={file => void dataBackup.import(file)}
        accept=".json"
        icon={FileJson2}
      />
    </OrChain>
  </Card>
)

const BackupReminderData = () => (
  <Card
    title={t`Backup reminder`}
    description={
      <Trans>
        To make sure you don't forget to backup your data, there will be a
        reminder every few days. Here you can define how often you want to be
        reminded.
      </Trans>
    }
  >
    <div className={cn(hstack({ gap: 4, wrap: true }), "mx-auto w-max")}>
      <NumberInput
        value={useAtom(dataBackupData).reminderSchedule}
        min={1}
        max={356}
        unit={t`day schedule`}
        onChange={(reminderSchedule = 1) =>
          dataBackupData.set(state => ({ ...state, reminderSchedule }))
        }
      />
      <Toggle
        label={t`Auto download`}
        checked={useAtom(dataBackupData).autoDownload}
        onChange={autoDownload =>
          dataBackupData.set(state => ({ ...state, autoDownload }))
        }
      />
    </div>
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
      <Trans>
        <Spinner size="sm" /> Importing data ({percent}%)
      </Trans>
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
    title: t`CSV Import`,
    duration: 0,
    message: <CsvImportProgress {...progress} />,
  })

  const byDate = splitByDates(data)
  await processWithPauses(
    Object.values(byDate).map(entries => () => {
      timeEntriesData.actions.add(...entries)
      progress.current += entries.length
      toast.edit({
        message: <CsvImportProgress {...progress} />,
      })
    })
  )

  toast.edit({
    kind: "success",
    title: t`CSV Import`,
    message: t`Imported ${data.length} entries`,
    duration: 5000,
  })
}

const ImportCsvData = () => {
  const [csv, setCsv] = useState<string | null>(null)
  return (
    <Card
      title={t`CSV Import / Export`}
      description={
        <Trans>
          Import or export a .csv file to move your data between clocktopus and
          other time tracking tools.
          <br />
          <span className="font-bold text-text">Note: </span>
          The new data will be added to your existing data! Make sure to create
          a backup before starting the import. If you want a clean start, delete
          your data first.
        </Trans>
      }
    >
      <OrChain>
        <Button
          look="ghost"
          icon={HardDriveDownload}
          onClick={() => csvExport(timeEntriesData.get())}
        >
          <Trans>Export .csv</Trans>
        </Button>

        <FileInput
          label={t`Import .csv`}
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
    title: t`Delete all data`,
    description: t`Do you want to delete all data and reset Clocktopus to its initial state?`,
    confirm: {
      caption: t`Confirm deletion`,
      look: "destructive",
      onClick: () => {
        allData.reset()
        showToast({
          kind: "success",
          title: t`Deleted data`,
        })
      },
    },
    cancel: {
      caption: t`Cancel`,
      look: "flat",
    },
  })

const DeleteData = () => (
  <Card
    title={t`Delete data`}
    description={
      <Trans>
        Delete all data and reset Clocktopus to its initial state.
        <br />
        <span className="font-bold text-text">Note: </span>
        Make sure to create a backup before deleting your data, this cannot be
        undone!
      </Trans>
    }
  >
    <Button look="destructive" icon={Trash} onClick={requestDeletion}>
      <Trans>Delete all data</Trans>
    </Button>
  </Card>
)

const Privacy = () => (
  <Card
    title="Data Privacy"
    description={
      <Trans>
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
      </Trans>
    }
  />
)

export const SettingsData = () => (
  <div className={cn(vstack({ gap: 2 }))}>
    <Privacy />
    <BackupData />
    <BackupReminderData />
    <ImportCsvData />
    <DeleteData />
  </div>
)
