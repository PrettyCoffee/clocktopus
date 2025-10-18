import { PropsWithChildren } from "react"

import { Router } from "wouter"
import { useHashLocation } from "wouter/use-hash-location"

import { DialogProvider } from "components/ui/dialog"
import { Toaster } from "components/ui/toaster"
import { Tooltip } from "components/ui/tooltip"

export const AppProviders = ({ children }: PropsWithChildren) => (
  // eslint-disable-next-line react-compiler/react-compiler
  <Router hook={useHashLocation}>
    <Tooltip.Provider>
      <Toaster />
      <DialogProvider />
      {children}
    </Tooltip.Provider>
  </Router>
)
