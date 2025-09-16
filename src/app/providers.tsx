import { PropsWithChildren } from "react"

import { DialogProvider } from "components/ui/dialog"
import { Toaster } from "components/ui/toaster"
import { Tooltip } from "components/ui/tooltip"

export const AppProviders = ({ children }: PropsWithChildren) => (
  <Tooltip.Provider>
    <Toaster />
    <DialogProvider />
    {children}
  </Tooltip.Provider>
)
