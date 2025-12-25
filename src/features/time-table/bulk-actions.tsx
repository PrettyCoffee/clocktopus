import { Dispatch, useState } from "react"

import { CheckCheck, SquarePen, Trash } from "lucide-react"

import { Button } from "components/ui/button"
import { DateInput } from "components/ui/date-input"
import { Dialog } from "components/ui/dialog"
import { Icon } from "components/ui/icon"
import { Input } from "components/ui/input"
import { InputLabel } from "components/ui/input-label"
import { MovableSnackBar } from "components/ui/movable-snack-bar"
import { showToast } from "components/ui/toaster"
import { preferencesData } from "data/preferences"
import { timeEntriesData, TimeEntry } from "data/time-entries"
import { CategorySelect } from "features/components/category-select"
import { useObjectState } from "hooks/use-object-state"
import { useAtom } from "lib/yaasl"
import { cn } from "utils/cn"
import { dateHelpers } from "utils/date-helpers"
import { hstack } from "utils/styles"

import { CheckedState, useCheckedState } from "./checked-context"

const getSelectedAmount = (checked: CheckedState) =>
  Object.values(checked).reduce(
    (result, checked) => result + Object.keys(checked).length,
    0
  )

interface BulkDeleteModalProps {
  selectedAmount: number
  onDelete: () => void
  onCancel: () => void
}
const BulkDeleteModal = ({
  selectedAmount,
  onDelete,
  onCancel,
}: BulkDeleteModalProps) => (
  <Dialog
    title="Delete time entries?"
    description="Do you really want to delete the selected time entries? This action cannot be reverted."
    onClose={onCancel}
    confirm={{
      look: "destructive",
      caption: `Delete ${selectedAmount} entries`,
      onClick: onDelete,
    }}
    cancel={{ caption: "Cancel", onClick: onCancel }}
  />
)

const mixedData = "<mixed>"
const getInitialData = (checked: CheckedState) => {
  const data = timeEntriesData.get()
  const [first, ...rest] = Object.entries(checked).flatMap(
    ([date, checked]) => {
      const dateEntries = data[date] ?? []
      const ids = new Set(Object.keys(checked))
      return dateEntries.filter(entry => ids.has(entry.id))
    }
  )

  const sameDescription = rest.every(
    ({ description }) => description === first?.description
  )
  const sameCategory = rest.every(
    ({ categoryId }) => categoryId === first?.categoryId
  )
  const sameDate = rest.every(({ date }) => date === first?.date)

  return {
    description: sameDescription ? first?.description : mixedData,
    date: sameDate ? first?.date : mixedData,
    categoryId: sameCategory ? first?.categoryId : mixedData,
  }
}

interface BulkEditModalProps {
  checked: CheckedState
  selectedAmount: number
  onEdit: Dispatch<Partial<TimeEntry>>
  onCancel: () => void
}
const BulkEditModal = ({
  checked,
  selectedAmount,
  onEdit,
  onCancel,
}: BulkEditModalProps) => {
  const initialState = getInitialData(checked)
  const [state, updateState] = useObjectState(initialState)

  const commitChanges = () => {
    const changes: Partial<TimeEntry> = {}
    if (state.description !== mixedData) changes.description = state.description
    if (state.date !== mixedData) changes.date = state.date
    if (state.categoryId !== mixedData) changes.categoryId = state.categoryId

    onEdit(changes)
  }

  return (
    <Dialog
      title="Edit time entries"
      description="Edit the fields you want to change and click on save to apply your changes."
      onClose={onCancel}
      confirm={{
        look: "ghost",
        caption: `Save ${selectedAmount} entries`,
        onClick: commitChanges,
      }}
      cancel={{ caption: "Cancel", onClick: onCancel }}
      className="w-[calc(100vw-2rem)] max-w-96"
    >
      <InputLabel label="Description">
        <Input
          type="text"
          placeholder="Description"
          value={state.description}
          onChange={description => updateState({ description })}
        />
      </InputLabel>

      <div className={cn(hstack({ gap: 2 }))}>
        <InputLabel label="Category" className="flex-1">
          <CategorySelect
            caption={state.categoryId === mixedData ? mixedData : undefined}
            value={state.categoryId ?? ""}
            onChange={categoryId => updateState({ categoryId })}
          />
        </InputLabel>

        <InputLabel label="Date">
          <DateInput
            caption={state.date === mixedData ? mixedData : undefined}
            locale={useAtom(preferencesData).locale}
            value={state.date === mixedData ? undefined : state.date}
            onChange={date => updateState({ date })}
            max={dateHelpers.today()}
          />
        </InputLabel>
      </div>
    </Dialog>
  )
}

export const TimeEntriesBulkActions = () => {
  const { checked, resetChecked } = useCheckedState()
  const [status, setStatus] = useState<"delete" | "edit" | null>(null)

  const selectedAmount = getSelectedAmount(checked)
  const hasChecked = selectedAmount > 0

  const close = () => setStatus(null)

  const checkedItems = Object.entries(checked).flatMap(([date, checked]) =>
    Object.keys(checked).map(id => ({ date, id }))
  )

  const handleDelete = () => {
    timeEntriesData.actions.delete(...checkedItems)
    showToast({ kind: "success", title: "Deleted selected entries" })
    resetChecked()
    close()
  }

  const handleEdit = (data: Partial<TimeEntry>) => {
    timeEntriesData.actions.edit(
      ...checkedItems.map(item => ({ ...item, data }))
    )
    showToast({ kind: "success", title: "Updated selected entries" })
    resetChecked()
    close()
  }

  return (
    <>
      {hasChecked && (
        <MovableSnackBar
          initialPosition={rect => ({
            x: window.innerWidth / 2 - rect.width / 2,
            y: window.innerHeight,
          })}
        >
          <div className={cn(hstack({ align: "center" }))}>
            <Icon icon={CheckCheck} size="sm" color="gentle" className="ml-2" />
            <span className="mx-2 text-text-gentle">{selectedAmount}</span>
            <span className="mx-2 h-6 w-px bg-stroke-gentle" />

            <Button icon={SquarePen} onClick={() => setStatus("edit")}>
              Edit
            </Button>
            <Button icon={Trash} onClick={() => setStatus("delete")}>
              Delete
            </Button>
          </div>
        </MovableSnackBar>
      )}

      {status === "delete" && (
        <BulkDeleteModal
          selectedAmount={selectedAmount}
          onDelete={handleDelete}
          onCancel={close}
        />
      )}

      {status === "edit" && (
        <BulkEditModal
          checked={checked}
          selectedAmount={selectedAmount}
          onCancel={close}
          onEdit={handleEdit}
        />
      )}
    </>
  )
}
