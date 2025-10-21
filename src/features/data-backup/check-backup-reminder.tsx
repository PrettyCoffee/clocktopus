import { HardDriveDownload, Settings } from "lucide-react"

import { showToast } from "components/ui/toaster"
import { dataBackupData } from "data/data-backup"
import { dateHelpers } from "utils/date-helpers"

import { dataBackup } from "./data-backup"

const shouldRemind = () => {
  const { last, reminderSchedule } = dataBackupData.get()
  return dateHelpers.daysSince(last) >= reminderSchedule
}

export const checkBackupReminder = async () => {
  await dataBackupData.didInit
  if (!shouldRemind()) return

  const toast = showToast({
    kind: "warn",
    title: "Backup Reminder",
    message: (
      <>
        You didn't backup your data for a while. Please create an export and
        save it, to prevent data loss.
      </>
    ),
    actions: [
      {
        icon: Settings,
        label: "Data Settings",
        look: "flat",
        to: "settings/data",
      },
      {
        icon: HardDriveDownload,
        label: "Export Data",
        look: "ghost",
        onClick: dataBackup.download,
      },
    ],
  })

  const unsubscribe = dataBackupData.subscribe(({ last, reminderSchedule }) => {
    if (dateHelpers.daysSince(last) >= reminderSchedule) return
    unsubscribe()
    toast.close()
  })
}
