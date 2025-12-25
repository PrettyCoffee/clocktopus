import { useAtom } from "lib/yaasl"

import { Dialog } from "./dialog"
import { dialogState } from "./dialog-data"

export const DialogProvider = () => {
  const dialog = useAtom(dialogState)
  return !dialog ? null : (
    <Dialog onClose={() => dialogState.set(null)} {...dialog} />
  )
}
