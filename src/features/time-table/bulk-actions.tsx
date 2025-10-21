import { useState } from "react"

import { Trash } from "lucide-react"

import { Button } from "components/ui/button"
import { Dialog } from "components/ui/dialog"
import { showToast } from "components/ui/toaster"
import { AutoAnimateHeight } from "components/utility/auto-animate-height"
import { timeEntriesData } from "data/time-entries"
import { cn } from "utils/cn"
import { hstack } from "utils/styles"

export type CheckedState = Record<string, Record<string, true>>

interface TimEntriesBulkActionsProps {
  checked: CheckedState
  resetChecked: () => void
}

const getSelectedAmount = (checked: CheckedState) =>
  Object.values(checked).reduce(
    (result, checked) => result + Object.keys(checked).length,
    0
  )

export const TimEntriesBulkActions = ({
  checked,
  resetChecked,
}: TimEntriesBulkActionsProps) => {
  const [status, setStatus] = useState<"delete" | null>(null)

  const selectedAmount = getSelectedAmount(checked)
  const hasChecked = selectedAmount > 0

  const forEachChecked = (action: (date: string, id: number) => void) => {
    Object.entries(checked).forEach(([date, checked]) =>
      Object.keys(checked).forEach(id => action(date, Number(id)))
    )
  }

  const handleDelete = () => {
    forEachChecked((date, id) => timeEntriesData.actions.delete(date, id))
    showToast({ kind: "success", title: "Deleted selected entries" })
    resetChecked()
    setStatus(null)
  }

  return (
    <>
      <AutoAnimateHeight duration={150}>
        <div
          className={cn(hstack({ align: "center" }), "pt-4 [&:has(*)]:pb-1")}
        >
          {hasChecked && (
            <Button icon={Trash} onClick={() => setStatus("delete")}>
              Delete selected
            </Button>
          )}
        </div>
      </AutoAnimateHeight>

      {status === "delete" && (
        <Dialog
          title="Delete time entries?"
          description="Do you really want to delete the selected time entries? This action cannot be reverted."
          confirm={{
            look: "destructive",
            caption: `Delete ${getSelectedAmount(checked)} entries`,
            onClick: handleDelete,
          }}
        />
      )}
    </>
  )
}
