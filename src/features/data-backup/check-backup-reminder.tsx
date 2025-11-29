import { HardDriveDownload, Settings } from "lucide-react"

import { showToast, ToastAction } from "components/ui/toaster"
import { dataBackupData } from "data/data-backup"
import { dateHelpers } from "utils/date-helpers"

import { dataBackup } from "./data-backup"

const shouldRemind = () => {
  const { last, reminderSchedule } = dataBackupData.get()
  return dateHelpers.daysSince(last) >= reminderSchedule
}

const toBackupSettings: ToastAction = {
  icon: Settings,
  label: "Data Settings",
  look: "flat",
  to: "settings/data",
}

const downloadBackup: ToastAction = {
  icon: HardDriveDownload,
  label: "Export Data",
  look: "ghost",
  onClick: dataBackup.download,
}

const suggestDownload = () => {
  const toast = showToast({
    kind: "warn",
    title: "Backup Reminder",
    message: (
      <>
        You didn't backup your data for a while. Please create an export and
        save it, to prevent data loss.
      </>
    ),
    actions: [toBackupSettings, downloadBackup],
  })

  const unsubscribe = dataBackupData.subscribe(() => {
    if (shouldRemind()) return
    unsubscribe()
    toast.close()
  })
}

const autoDownload = () => {
  let canceled = false

  const toast = showToast({
    kind: "info",
    title: "Automated backup",
    duration: 5000,
    message: (
      <>A backup of your data will be created automatically in a moment.</>
    ),
    actions: [
      {
        label: "Cancel",
        look: "ghost",
        onClick: () => {
          canceled = true
          toast.edit({
            kind: "warn",
            duration: undefined,
            message: (
              <>
                Automated backup was cancelled. You can permanently disable it
                in the data settings.
              </>
            ),
            actions: [toBackupSettings, downloadBackup],
          })
        },
      },
    ],
  })

  setTimeout(() => {
    if (canceled) return
    dataBackup.download()
  }, 5000)
}

export const checkBackupReminder = async () => {
  await dataBackupData.didInit
  if (!shouldRemind()) return

  const data = dataBackupData.get()
  if (data.autoDownload) {
    autoDownload()
  } else {
    suggestDownload()
  }
}
