import { useState } from "react"

import { CheckCheck, Trash } from "lucide-react"

import { Button } from "components/ui/button"
import { Dialog } from "components/ui/dialog"
import { Icon } from "components/ui/icon"
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

  const close = () => setStatus(null)

  const handleDelete = () => {
    const checkedItems = Object.entries(checked).flatMap(([date, checked]) =>
      Object.keys(checked).map(id => ({ date, id }))
    )
    timeEntriesData.actions.delete(...checkedItems)
    showToast({ kind: "success", title: "Deleted selected entries" })
    resetChecked()
    close()
  }

  return (
    <>
      <AutoAnimateHeight duration={150}>
        <div className={cn("pt-4 [&:has(*)]:pb-1")}>
          {hasChecked && (
            <div className={cn(hstack({ align: "center" }), "pl-5")}>
              <Icon icon={CheckCheck} size="sm" color="muted" />
              <span className="mx-2 text-text-gentle">{selectedAmount}</span>
              <span className="mx-2 h-6 w-px bg-stroke-gentle" />

              <Button icon={Trash} onClick={() => setStatus("delete")}>
                Delete
              </Button>
            </div>
          )}
        </div>
      </AutoAnimateHeight>

      {status === "delete" && (
        <Dialog
          title="Delete time entries?"
          description="Do you really want to delete the selected time entries? This action cannot be reverted."
          onClose={close}
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
